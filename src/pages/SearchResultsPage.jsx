import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import api from "../utils/api";
import MaterialCard from "../components/MaterialCard";
import Footer from "../components/Footer";
import { FaFilter } from "react-icons/fa";
import { normalizeDocumentSummaryToMaterial } from "../utils/normalize.js";

// FileType enum
const FileType = Object.freeze({
  PDF: "682ae32096419d753dd1c053",
  DOC: "683e9b77ab6afe8c54e9ee46",
  PPT: "68356afcf4697dae5a627f30",
});

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [materials, setMaterials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleRows, setVisibleRows] = useState(5);
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [fileType, setFileType] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch materials by search query
  useEffect(() => {
    console.log("Search query:", query);
    const fetchMaterials = async () => {
      setIsLoading(true);
      setMaterials([]);
      try {
        // FastAPI OpenAPI: GET /api/search?keywords=...
        const res = await api.get('/api/search', {
          params: { keywords: query, page: 1, limit: 30 },
        });
        const docs = Array.isArray(res?.data?.data) ? res.data.data : [];
        setMaterials(docs.map(normalizeDocumentSummaryToMaterial));
      } catch (err) {
        console.error("Error loading materials:", err.response?.data || err);
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchMaterials();
    } else {
      setIsLoading(false);
      setMaterials([]);
    }
  }, [query]);

  // Memoized filtered materials
  const filteredMaterials = useMemo(() => {
    let updatedMaterials = [...materials];

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      if (!isNaN(startDate) && !isNaN(endDate) && startDate <= endDate) {
        endDate.setHours(23, 59, 59, 999); // Include full end date
        updatedMaterials = updatedMaterials.filter((material) => {
          if (!material?.created_at) return true; // openapi spec có thể không trả created_at
          const createdAt = new Date(material.created_at);
          if (isNaN(createdAt.getTime())) return true;
          return createdAt >= startDate && createdAt <= endDate;
        });
      }
    }

    // Filter by file type
    if (fileType) {
      updatedMaterials = updatedMaterials.filter(
        (material) => material.file_type === fileType
      );
    }

    return updatedMaterials;
  }, [materials, dateRange, fileType]);

  const handleViewMore = () => {
    setVisibleRows((prev) => prev + 5);
  };

  const handleDateRangeChange = (e) => {
    const { name, value } = e.target;
    setDateRange((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileTypeChange = (e) => {
    setFileType(e.target.value);
  };

  const clearFilters = () => {
    setDateRange({ start: "", end: "" });
    setFileType("");
    setIsFilterOpen(false); // Optionally close filter panel
  };

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  const displayedMaterials = filteredMaterials.slice(0, visibleRows * 3);
  const hasMore = filteredMaterials.length > displayedMaterials.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
          Kết quả cho "{query}"
        </h2>

        {/* Filter Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <button
            onClick={toggleFilter}
            className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-md hover:bg-indigo-50 transition-colors duration-200"
          >
            <FaFilter className="text-gray-600" />
            <span className="text-gray-700 font-medium">Lộc</span>
          </button>
        </div>

        {/* Filter Panel */}
        {isFilterOpen && (
          <div className="mb-8 p-4 bg-white rounded-lg shadow-md">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày bắt đầu
                </label>
                <input
                  type="date"
                  name="start"
                  value={dateRange.start}
                  onChange={handleDateRangeChange}
                  className="w-full px-4 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày kết thúc
                </label>
                <input
                  type="date"
                  name="end"
                  value={dateRange.end}
                  onChange={handleDateRangeChange}
                  className="w-full px-4 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại tệp
                </label>
                <select
                  value={fileType}
                  onChange={handleFileTypeChange}
                  className="w-full px-4 py-2 bg-white rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="">Tất cả</option>
                  <option value={FileType.PDF}>PDF</option>
                  <option value={FileType.DOC}>DOC</option>
                  <option value={FileType.PPT}>PPT</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Xóa bộ lộc
                </button>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedMaterials.length > 0 ? (
                displayedMaterials.map((material, index) => (
                  <div key={material.id || index} className="transform hover:scale-105 transition-transform duration-300">
                    <MaterialCard material={material} />
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-gray-500 text-lg">No materials found for "{query}"</p>
                </div>
              )}
            </div>

            {hasMore && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleViewMore}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors duration-300 shadow-md"
                >
                  View More
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default SearchResultsPage;