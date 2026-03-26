import { useEffect, useState, useRef } from "react";
import { getTopMaterialsByCategory } from "../apis/materialApis";
import MaterialCard from "../components/MaterialCard";
import Footer from "../components/Footer";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getAllCategories } from '../apis/categoryApis';
import { Link } from 'react-router-dom';
import banner from '@imgs/banner.jpg';

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [showFilter, setShowFilter] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [materialsByCategory, setMaterialsByCategory] = useState([]);
  const scrollRefs = useRef([]);
  const bannerRef = useRef(null);

  useEffect(() => {
    console.log("Banner URL:", banner); // Debug import
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        setCategories(res);
      } catch (err) {
        console.error("Lỗi khi tải danh mục:", err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        if (!categories || categories.length === 0) return;
        setIsLoading(true);

        const updatedMaterials = [];
        for (const category of categories) {
          const response = await getTopMaterialsByCategory(category.id);
          updatedMaterials.push({
            category: response.category || category,
            materials: response.materials || [],
          });
        }
        setMaterialsByCategory(updatedMaterials);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching materials:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });
        setIsLoading(false);
      }
    };

    fetchMaterials();
  }, [categories]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY) {
        setShowFilter(false);
      } else if (currentScrollY < lastScrollY) {
        setShowFilter(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log("Banner intersecting:", entry.isIntersecting); // Debug
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fadeInUp");
          }
        });
      },
      { threshold: 0.1 }
    );

    if (bannerRef.current) {
      observer.observe(bannerRef.current);
    }

    return () => {
      if (bannerRef.current) {
        observer.unobserve(bannerRef.current);
      }
    };
  }, []);

  const scrollLeft = (index) => {
    const container = scrollRefs.current[index];
    if (container) {
      container.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = (index) => {
    const container = scrollRefs.current[index];
    if (container) {
      container.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Filter */}
        <div
          className={`transition-all duration-300 sticky top-0 w-full h-16 bg-gray-800 z-20 shadow-md ${
            showFilter ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
          }`}
        >
          <div className="h-full flex items-center justify-center space-x-4 overflow-x-auto px-4 scrollbar-hide">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${encodeURIComponent(cat.name)}`}
                className="text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 bg-gray-600 hover:bg-gray-500"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Banner */}
        {/* Banner */}
        <div className="relative w-full h-64 md:h-96">
          <img
            src={banner}
            alt="Banner Image"
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/20 bg-opacity-30 flex items-center justify-center">
            <h1 className="text-white text-3xl md:text-5xl font-bold text-center">
              Khám phá kho tài liệu tuyệt vời!
            </h1>
          </div>
        </div>

        {/* Materials by Category */}
        {materialsByCategory.length > 0 ? (
          materialsByCategory.map(({ category, materials }, catIndex) => (
            <div key={category.id} className="px-4 py-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Phổ biến nhất trong lĩnh vực {category.name}</h2>
              <div className="relative flex items-center">
                <button
                  onClick={() => scrollLeft(catIndex)}
                  className="absolute left-0 z-10 p-2 h-full bg-transparent group cursor-pointer"
                  aria-label="Scroll left"
                >
                  <FaChevronLeft className="text-gray-400 text-2xl group-hover:text-black transition-colors duration-200" />
                </button>

                <div
                  ref={(el) => (scrollRefs.current[catIndex] = el)}
                  className="overflow-x-auto scrollbar-hide flex-1"
                  style={{ scrollBehavior: "smooth" }}
                >
                  <div className="flex flex-shrink-0 gap-9">
                    {materials.length > 0 ? (
                      materials.map((material, index) => (
                        <div key={material.id || `material-${index}`}>
                          <MaterialCard material={material} />
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 w-full">No materials found for {category.name}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => scrollRight(catIndex)}
                  className="absolute right-0 z-10 p-2 h-full bg-transparent group cursor-pointer"
                  aria-label="Scroll right"
                >
                  <FaChevronRight className="text-gray-400 text-2xl group-hover:text-black transition-colors duration-200" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No categories loaded.</p>
        )}
        <Footer />
      </div>
    );
  }
};

export default Home;