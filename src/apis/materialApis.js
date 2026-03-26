import api from "../utils/api.js";
import { normalizeCategoryList, normalizeDocumentDetailsToMaterial, normalizeDocumentSummaryToMaterial, unwrapApiResponse } from "../utils/normalize.js";
import { getAllCategories } from "./categoryApis.js";

async function getCategoryIdByName(categoryName) {
  const categories = await getAllCategories();
  const normalizedName = (categoryName || "").trim().toLowerCase();
  const match = categories.find((c) => (c.name || "").trim().toLowerCase() === normalizedName);
  return match?.id ?? null;
}

async function searchDocuments({ keywords, category_id, page = 1, limit = 10 }) {
  // FastAPI OpenAPI: GET /api/search?keywords=...&category_id=...&page=...&limit=...
  const res = await api.get("/api/search", {
    params: {
      keywords: keywords ?? "",
      category_id: category_id ?? null,
      page,
      limit,
    },
  });
  const data = unwrapApiResponse(res.data);
  // ResponsePaginationSchema_*: { data: array, meta: ... }
  return data;
}

const getMaterialsByCategory = async (categoryName) => {
  try {
    const category_id = await getCategoryIdByName(categoryName);
    const res = await searchDocuments({
      keywords: categoryName,
      category_id,
      page: 1,
      limit: 30,
    });
    const docs = Array.isArray(res?.data) ? res.data : [];
    return { materials: docs.map(normalizeDocumentSummaryToMaterial) };
  } catch (error) {
    console.error("Error fetching materials by category:", error);
    return { materials: [] };
  }
};

const getTopMaterialsByCategory = async (category_id) => {
  try {
    const categories = await getAllCategories();
    const res = await searchDocuments({
      keywords: "",
      category_id,
      page: 1,
      limit: 12,
    });

    const docs = Array.isArray(res?.data) ? res.data : [];
    const materials = docs.map(normalizeDocumentSummaryToMaterial);

    // Home.jsx cũ đang mong "category" và "materials"
    const category = {
      id: category_id,
      name: categories.find((c) => String(c.id) === String(category_id))?.name || "",
    };

    return { category, materials };
  } catch (error) {
    console.error("Error fetching top materials by category:", error);
    return { category: { id: category_id, name: "" }, materials: [] };
  }
};

const getRelatedMaterials = async (material_id) => {
  try {
    const res = await api.get(`/api/recommendation/similar/${material_id}`);
    const data = unwrapApiResponse(res.data);
    // Trường hợp spec dùng: ResponseSuccessSchema_list_DocumentSummaryResponse__
    const docs = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : data?.data || [];
    return { materials: (Array.isArray(docs) ? docs : []).map(normalizeDocumentSummaryToMaterial) };
  } catch (error) {
    console.error("Error fetching related materials:", error);
    return { materials: [] };
  }
};

// -----------------------------
// Saved/Collections (bookmark)
// -----------------------------
const COLLECTION_LATER_NAME = "Later";

async function getCollectionIdByName(name) {
  const res = await api.get("/api/collections");
  const data = unwrapApiResponse(res.data);
  const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : data?.data || data;

  const match = (Array.isArray(list) ? list : []).find((c) => (c?.name || "").toLowerCase() === name.toLowerCase());
  return match?.id ?? match?.collection_id ?? match?.collectionId ?? null;
}

async function createCollection(name) {
  const res = await api.post("/api/collections", { name });
  const data = unwrapApiResponse(res.data);
  // spec có thể không mô tả id; fallback theo field có sẵn
  return data?.id ?? data?.collection_id ?? data?.collectionId ?? null;
}

async function getOrCreateCollectionId(name) {
  const existing = await getCollectionIdByName(name);
  if (existing) return existing;
  const created = await createCollection(name);
  if (created) return created;
  throw new Error(`Không thể lấy collection_id cho "${name}"`);
}

const toggleSaveLater = async (materialId) => {
  try {
    const collectionId = await getOrCreateCollectionId(COLLECTION_LATER_NAME);
    // OpenAPI:
    // PUT /api/collections/{collection_id}/items/{document_id} -> add
    // DELETE /api/collections/{collection_id}/items/{document_id} -> remove
    try {
      await api.put(`/api/collections/${collectionId}/items/${materialId}`);
      return { saved: true, message: "Đã lưu vào Xem sau" };
    } catch (addErr) {
      await api.delete(`/api/collections/${collectionId}/items/${materialId}`);
      return { saved: false, message: "Đã bỏ lưu khỏi Xem sau" };
    }
  } catch (error) {
    console.error("toggleSaveLater error:", error);
    // Trả cấu trúc cũ để UI không crash
    return { saved: false, message: "Chưa hỗ trợ lưu 'Xem sau' theo FastAPI" };
  }
};

const toggleSaveList = async (materialId, listId) => {
  try {
    const collectionId = listId;
    try {
      await api.put(`/api/collections/${collectionId}/items/${materialId}`);
      return { saved: true, message: "Đã thêm vào danh sách" };
    } catch (addErr) {
      await api.delete(`/api/collections/${collectionId}/items/${materialId}`);
      return { saved: false, message: "Đã xóa khỏi danh sách" };
    }
  } catch (error) {
    console.error("toggleSaveList error:", error);
    return { saved: false, message: "Chưa hỗ trợ lưu danh sách theo FastAPI" };
  }
};

const getMyListWithStatus = async (materialId) => {
  // Spec không cung cấp endpoint "list-status per document". Ta chỉ trả danh sách collections để UI hiển thị,
  // trạng thái saved sẽ set mặc định false.
  try {
    const res = await api.get("/api/collections");
    const data = unwrapApiResponse(res.data);
    const list = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : data?.data || [];
    const collections = (Array.isArray(list) ? list : []).map((c) => ({
      id: c?.id ?? c?.collection_id ?? c?.collectionId ?? c?.name,
      name: c?.name,
      is_saved: false,
    }));
    return { lists: collections };
  } catch (error) {
    console.error("getMyListWithStatus error:", error);
    return { lists: [] };
  }
};

// -----------------------------
// Document management
// -----------------------------
export const getUserUploadedMaterials = async () => {
  try {
    const res = await api.get("/api/documents", { params: { page: 1, limit: 50 } });
    const data = unwrapApiResponse(res.data);
    const docs = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : data?.data || [];
    return docs.map(normalizeDocumentSummaryToMaterial);
  } catch (error) {
    console.error("Error in getUserUploadedMaterials:", error);
    return [];
  }
};

export const deleteMaterial = async (materialId) => {
  const res = await api.delete(`/api/documents/${materialId}`);
  return unwrapApiResponse(res.data);
};

export const updateMaterial = async (materialId, updateData) => {
  // OpenAPI: patch /api/documents/{document_id}
  // DocumentUpdateRequest: { title?, desc?, visibility?, category_id? }
  const payload = {
    title: updateData?.title,
    desc: updateData?.desc ?? updateData?.description ?? null,
    visibility: updateData?.visibility,
  };
  const res = await api.patch(`/api/documents/${materialId}`, payload);
  return unwrapApiResponse(res.data);
};

export const toggleMaterialVisibility = async (materialId, visibility) => {
  const res = await api.patch(`/api/documents/${materialId}`, { visibility });
  return unwrapApiResponse(res.data);
};

export { getMaterialsByCategory, toggleSaveLater, getRelatedMaterials, getTopMaterialsByCategory, toggleSaveList, getMyListWithStatus, normalizeDocumentDetailsToMaterial };
