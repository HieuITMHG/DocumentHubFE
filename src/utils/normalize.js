export function unwrapApiResponse(payload) {
  // Backend FastAPI theo OpenAPI thường trả: { success, data, message, ... }
  // Axios trả payload = response.data
  if (payload && typeof payload === 'object' && 'data' in payload) return payload.data;
  return payload;
}

export function normalizeSelfInfo(selfInfo) {
  // SelfInfoResponse: { role, username, email }
  if (!selfInfo) return null;
  return {
    username: selfInfo.username,
    email: selfInfo.email,
    role_id: selfInfo.role, // để tương thích existing RoleType usage
    role: selfInfo.role,
    // Các field cũ đang được UI dùng (có thể backend không trả): để tránh undefined crash
    first_name: selfInfo.first_name || '',
    last_name: selfInfo.last_name || '',
    phone: selfInfo.phone || '',
    organization: selfInfo.organization || '',
    bio: selfInfo.bio || '',
    gender: selfInfo.gender || '',
    full_name: selfInfo.full_name || selfInfo.username,
  };
}

function normalizeOwnerToUser(owner) {
  // openapi DocumentSummary/Details: owner: string
  return {
    userId: owner,
    username: owner,
    account: { username: owner }, // MaterialDetail đang truy cập material.user.account?.username
  };
}

export function normalizeDocumentSummaryToMaterial(doc) {
  // DocumentSummaryResponse
  if (!doc) return null;
  return {
    id: doc.id,
    title: doc.title,
    description: doc.desc || '',
    thumbnail_path: doc.file_thumbnail_url,
    file_type: doc.file_type,
    user: normalizeOwnerToUser(doc.owner),
    total_pages: doc.page_count || 0,
    total_views: doc.view_count,
    total_likes: doc.like_count || 0,
    original_file_path: doc.file_original_url,
    pdf_version_path: doc.file_preview_url,
    created_at: doc.created_at ?? undefined,
    tags: doc.tags || [],
    is_saved: false,
    is_liked: false,
    visibility: doc.visibility || 'PUBLIC',
    status: doc.status,
  };
}

export function normalizeDocumentDetailsToMaterial(doc) {
  // DocumentDetailsResponse
  if (!doc) return null;
  return {
    id: doc.id,
    title: doc.title,
    description: doc.desc,
    thumbnail_path: doc.file_thumbnail_url,
    file_type: doc.file_type,
    user: normalizeOwnerToUser(doc.owner),
    total_pages: doc.page_count,
    total_views: doc.view_count,
    total_likes: doc.like_count,
    original_file_path: doc.file_original_url,
    pdf_version_path: doc.file_preview_url,
    created_at: undefined,
    tags: doc.tags || [],
    is_saved: false,
    is_liked: false,
    visibility: doc.visibility || 'PUBLIC',
    status: doc.status,
    // giữ tên field cũ mà một số nơi có thể dùng
    pdfUrl: doc.file_preview_url,
  };
}

export function normalizeCategoryList(data) {
  // ResponseSuccessSchema_list_CategorySchema__: data là array CategorySchema
  if (!data) return [];
  if (Array.isArray(data)) return data.map((c) => ({ id: c.id, name: c.name }));
  if (Array.isArray(data.data)) return data.data.map((c) => ({ id: c.id, name: c.name }));
  return [];
}

