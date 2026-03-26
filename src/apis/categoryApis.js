import publicApi from "../utils/publicApi";
import { normalizeCategoryList, unwrapApiResponse } from "../utils/normalize.js";

const getAllCategories = async () => {
    try {
        // FastAPI OpenAPI: GET /api/documents/categories
        const res = await publicApi.get('/api/documents/categories');
        return normalizeCategoryList(res.data);
    } catch(error) {
        console.error(error);
        return [];
    }
    
}

export { getAllCategories };