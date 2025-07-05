import React, { useEffect, useState, useRef, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    selectProducts,
    selectProductsErrors,
    selectProductsPagination,
    selectProductsStatus,
} from "../selectors/ProductsSelectors.jsx";
import { fetchProducts, resetFilters } from "../features/productsSlice.jsx";
import { backendBaseUrl } from "../API/axios.js";
import { fetchCategories } from "../features/categoriesSlice.jsx";
import { addToCart } from "../features/cartSlice.jsx";
import { selectIsAuthenticated } from "../selectors/authSelectors.jsx";
import { useNavigate } from "react-router-dom";
import { FaSearch, FaFilter, FaTimes } from "react-icons/fa";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { menuHero } from "../constants/index.js";

// Register ScrollTrigger with GSAP
gsap.registerPlugin(ScrollTrigger);

// Memoize selectors to prevent unnecessary recalculations
const memoizedSelectProducts = (state) => selectProducts(state);
const memoizedSelectProductsStatus = (state) => selectProductsStatus(state);
const memoizedSelectProductsErrors = (state) => selectProductsErrors(state);
const memoizedSelectProductsPagination = (state) =>
    selectProductsPagination(state);
const memoizedSelectIsAuthenticated = (state) => selectIsAuthenticated(state);
const memoizedSelectCategories = (state) => state.categories.categories;

const ProductsGrid = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(memoizedSelectIsAuthenticated);
    const products = useSelector(memoizedSelectProducts);
    const status = useSelector(memoizedSelectProductsStatus);
    const error = useSelector(memoizedSelectProductsErrors);
    const paginationData = useSelector(memoizedSelectProductsPagination);
    const categories = useSelector(memoizedSelectCategories);
    const [sortOption, setSortOption] = useState("newest");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef(null);
    const lenisRef = useRef(null);

    // Handle click outside to close filter panel on mobile and md screens
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                filterRef.current &&
                !filterRef.current.contains(event.target) &&
                isFilterOpen &&
                window.innerWidth < 1024
            ) {
                setIsFilterOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isFilterOpen]);

    useEffect(() => {
        dispatch(fetchCategories());
    }, [dispatch]);

    // Initialize Lenis smooth scrolling
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothTouch: true,
        });

        lenisRef.current = lenis;

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
            lenisRef.current = null;
        };
    }, []);

    // GSAP animations for elements with animate-section class
    useEffect(() => {
        const sections = document.querySelectorAll(".animate-section");

        sections.forEach((section, index) => {
            gsap.fromTo(
                section,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        });

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, []);

    const handleAddToCart = (product) => {
        if (isLoggedIn) {
            dispatch(
                addToCart({
                    id: product.produitId,
                    name: product.nom,
                    price: product.prix,
                    image: product.imageUrl,
                })
            );
        } else {
            navigate("/login");
        }
    };

    const [filters, setFilters] = useState({
        category_id: "",
        min_price: "",
        max_price: "",
        type: "",
        search: "",
    });

    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 12,
        total: 0,
        last_page: 1,
    });

    useEffect(() => {
        const params = {
            page: pagination.current_page,
            per_page: pagination.per_page,
        };

        Object.keys(filters).forEach((key) => {
            if (filters[key]) {
                params[key] = filters[key];
            }
        });

        if (sortOption === "newest") {
            params.sort_by = "created_at";
            params.sort_dir = "desc";
        } else if (sortOption === "price-low") {
            params.sort_by = "prix";
            params.sort_dir = "asc";
        } else if (sortOption === "price-high") {
            params.sort_by = "prix";
            params.sort_dir = "desc";
        }

        dispatch(fetchProducts(params));
    }, [
        dispatch,
        pagination.current_page,
        pagination.per_page,
        filters,
        sortOption,
    ]);

    useEffect(() => {
        if (status === "succeeded" && paginationData) {
            setPagination((prev) => ({
                ...prev,
                total: paginationData.total || 0,
                last_page: paginationData.last_page || 1,
            }));
        }
    }, [status, paginationData]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
        setPagination((prev) => ({
            ...prev,
            current_page: 1,
        }));
    };

    const handleClearFilters = () => {
        setFilters({
            category_id: "",
            min_price: "",
            max_price: "",
            type: "",
            search: "",
        });
        dispatch(resetFilters());
        setPagination((prev) => ({
            ...prev,
            current_page: 1,
        }));
    };

    const handlePageChange = (page) => {
        setPagination((prev) => ({
            ...prev,
            current_page: page,
        }));
        if (lenisRef.current) {
            lenisRef.current.scrollTo(0, { duration: 1.2 });
        }
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        const totalPages = pagination.last_page;
        const currentPage = pagination.current_page;

        pageNumbers.push(1);
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        if (startPage > 2) pageNumbers.push("...");
        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }
        if (endPage < totalPages - 1) pageNumbers.push("...");
        if (totalPages > 1) pageNumbers.push(totalPages);

        return pageNumbers;
    };

    const getUniqueValues = (key) => {
        if (!Array.isArray(products)) return [];
        return [
            ...new Set(products.map((product) => product[key]).filter(Boolean)),
        ];
    };

    useEffect(() => {
        return () => {
            setFilters({
                category_id: "",
                min_price: "",
                max_price: "",
                type: "",
                search: "",
            });

            setPagination({
                current_page: 1,
                per_page: 12,
                total: 0,
                last_page: 1,
            });

            dispatch(
                fetchProducts({
                    page: 1,
                    per_page: 50,
                    sort_by: "created_at",
                    sort_dir: "desc",
                })
            );
        };
    }, []);

    return (
        <section className="py-8 sm:py-12 lg:py-16 min-h-screen bg-[#f5ecde]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="relative mb-8 sm:mb-10 lg:mb-12 h-[250px] sm:h-[350px] lg:h-[450px] rounded-3xl overflow-hidden shadow-2xl animate-section">
                    <img
                        src={menuHero}
                        className="w-full h-full object-cover"
                        alt="Our Menu"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-[#f5ecde]/10 to-[#f5ecde]/10" />
                    <div className="absolute top-1/4 sm:top-1/3 left-4 sm:left-8 lg:left-12">
                        <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-2 sm:mb-4 text-[#1c2526]">
                            Savor Our{" "}
                            <span className="text-[#d4a017]">Flavors</span>
                        </h1>
                        <p className="text-sm sm:text-lg md:text-xl max-w-xs sm:max-w-md text-gray-100">
                            Discover authentic Moroccan dishes crafted with love
                        </p>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 relative">
                    <button
                        className="lg:hidden rounded-full px-4 py-2 text-sm font-medium flex items-center bg-[#1a3c34] text-[#f5ecde] animate-section"
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                    >
                        <FaFilter className="mr-2" />
                        Filters
                    </button>

                    <div
                        className={`lg:block fixed inset-0 lg:static h-full w-full sm:w-80 lg:w-1/4 p-4 sm:p-6 transition-transform duration-300 transform ${
                            isFilterOpen
                                ? "translate-x-0"
                                : "-translate-x-full lg:translate-x-0"
                        } bg-[#e8d9c2] z-50 overflow-y-auto`}
                        ref={filterRef}
                    >
                        <div className="flex justify-between items-center mb-4 sm:mb-6">
                            <h3 className="text-xl sm:text-2xl font-bold text-[#1c2526]">
                                Filters
                            </h3>
                            <button
                                className="lg:hidden"
                                onClick={() => setIsFilterOpen(false)}
                            >
                                <FaTimes className="h-5 w-5 text-[#86868b]" />
                            </button>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            <div>
                                <label
                                    htmlFor="search"
                                    className="block text-sm font-medium mb-2 text-[#86868b]"
                                >
                                    Search Dishes
                                </label>
                                <div className="relative">
                                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#86868b]" />
                                    <input
                                        type="text"
                                        id="search"
                                        name="search"
                                        value={filters.search}
                                        onChange={handleFilterChange}
                                        placeholder="Search by dish name..."
                                        className="w-full rounded-full border pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 bg-[#f5ecde] border-[#d1d5db] text-[#1c2526] focus:ring-[#d4a017]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="min_price"
                                    className="block text-sm font-medium mb-2 text-[#86868b]"
                                >
                                    Min Price ($)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#86868b]">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        id="min_price"
                                        name="min_price"
                                        value={filters.min_price}
                                        onChange={handleFilterChange}
                                        placeholder="Min"
                                        className="w-full rounded-full border pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 bg-[#f5ecde] border-[#d1d5db] text-[#1c2526] focus:ring-[#d4a017]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="max_price"
                                    className="block text-sm font-medium mb-2 text-[#86868b]"
                                >
                                    Max Price ($)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#86868b]">
                                        $
                                    </span>
                                    <input
                                        type="number"
                                        id="max_price"
                                        name="max_price"
                                        value={filters.max_price}
                                        onChange={handleFilterChange}
                                        placeholder="Max"
                                        className="w-full rounded-full border pl-8 pr-4 py-2 text-sm focus:outline-none focus:ring-2 bg-[#f5ecde] border-[#d1d5db] text-[#1c2526] focus:ring-[#d4a017]"
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor="type"
                                    className="block text-sm font-medium mb-2 text-[#86868b]"
                                >
                                    Dish Type
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    value={filters.type}
                                    onChange={handleFilterChange}
                                    className="w-full rounded-full border px-4 py-2 text-sm focus:outline-none focus:ring-2 appearance-none bg-[#f5ecde] border-[#d1d5db] text-[#1c2526] focus:ring-[#d4a017]"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2386868b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                                        backgroundPosition:
                                            "right 0.75rem center",
                                        backgroundRepeat: "no-repeat",
                                        paddingRight: "2.5rem",
                                    }}
                                >
                                    <option value="" className="text-[#86868b]">
                                        All Types
                                    </option>
                                    {getUniqueValues("type").map((type) => (
                                        <option
                                            key={type}
                                            value={type}
                                            className="text-[#1c2526]"
                                        >
                                            {type}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-[#86868b]">
                                    Category
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        className="px-3 sm:px-4 py-1 rounded-full text-sm cursor-pointer border border-[#d1d5db]"
                                        style={{
                                            backgroundColor:
                                                filters.category_id === ""
                                                    ? "#d4a017"
                                                    : "#f5ecde",
                                            color:
                                                filters.category_id === ""
                                                    ? "#27272a"
                                                    : "#86868b",
                                        }}
                                        onClick={handleFilterChange}
                                        value=""
                                        name="category_id"
                                    >
                                        All
                                    </button>
                                    {categories?.map((category) => (
                                        <button
                                            key={category.categoryId}
                                            className={`px-3 sm:px-4 py-1 rounded-full text-sm cursor-pointer border border-[#d1d5db] ${
                                                category.categoryId ==
                                                filters.category_id
                                                    ? "bg-[#d4a017] text-[#27272a]"
                                                    : "bg-[#f5ecde] text-[#86868b]"
                                            } border-[#d1d5db] hover:bg-[#d4a017] hover:text-black`}
                                            value={category.categoryId}
                                            onClick={handleFilterChange}
                                            name="category_id"
                                        >
                                            {category.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleClearFilters}
                                className="w-full rounded-full bg-[#d4a017] hover:bg-[#facc15] px-4 py-2 text-sm font-medium cursor-pointer"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>

                    {isFilterOpen && (
                        <div
                            className="lg:hidden fixed inset-0 bg-black/50 z-40"
                            onClick={() => setIsFilterOpen(false)}
                        />
                    )}

                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 animate-section">
                            <h2 className="text-xl sm:text-2xl font-bold text-[#1c2526]">
                                Our Dishes
                            </h2>
                            <div className="relative mt-2 sm:mt-0">
                                <select
                                    value={sortOption}
                                    onChange={(e) =>
                                        setSortOption(e.target.value)
                                    }
                                    className="rounded-full border px-3 sm:px-4 py-2 text-sm focus:outline-none focus:ring-2 appearance-none cursor-pointer bg-[#f5ecde] border-[#d1d5db] text-[#1c2526] focus:ring-[#d4a017]"
                                    style={{
                                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2386868b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                                        backgroundPosition:
                                            "right 0.75rem center",
                                        backgroundRepeat: "no-repeat",
                                        paddingRight: "2.5rem",
                                    }}
                                >
                                    <option value="newest">Newest</option>
                                    <option value="price-low">
                                        Price: Low to High
                                    </option>
                                    <option value="price-high">
                                        Price: High to Low
                                    </option>
                                </select>
                            </div>
                        </div>

                        {status === "loading" && (
                            <div className="my-8 sm:my-12 flex items-center justify-center animate-section">
                                <div className="h-10 sm:h-12 w-10 sm:w-12 animate-spin rounded-full border-4 border-t-4 border-[#d1d5db] border-t-[#d4a017]" />
                            </div>
                        )}

                        {status === "failed" && (
                            <div className="my-8 sm:my-12 rounded-2xl p-4 sm:p-6 text-center bg-[#f5ecde] text-[#1c2526] animate-section">
                                <p>
                                    {error ||
                                        "Error loading dishes. Please try again."}
                                </p>
                            </div>
                        )}

                        {status === "succeeded" &&
                            (!products || products.length === 0) && (
                                <div className="my-8 sm:my-12 rounded-2xl p-6 sm:p-8 text-center bg-[#f5ecde] animate-section">
                                    <h3 className="text-base sm:text-lg font-medium text-[#1c2526]">
                                        No dishes found
                                    </h3>
                                    <p className="text-[#86868b] text-sm sm:text-base">
                                        Try adjusting your filters or search
                                        criteria.
                                    </p>
                                    <button
                                        onClick={handleClearFilters}
                                        className="mt-4 rounded-full px-4 py-2 text-sm font-medium bg-[#1a3c34] text-[#f5ecde]"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            )}

                        {status === "succeeded" &&
                            products &&
                            products.length > 0 && (
                                <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                                    {products.map((product) => (
                                        <div
                                            key={product.produitId}
                                            className="product-card rounded-2xl shadow-lg overflow-hidden bg-[#f5ecde] animate-section"
                                        >
                                            <a
                                                href={`/product/${product.produitId}`}
                                            >
                                                <img
                                                    className="w-full h-48 sm:h-56 object-cover"
                                                    src={
                                                        backendBaseUrl +
                                                        product.imageUrl
                                                    }
                                                    alt={product.nom}
                                                    loading="lazy"
                                                    decoding="async"
                                                />
                                            </a>
                                            <div className="p-4 sm:p-5 text-center">
                                                <a
                                                    href={`/product/${product.produitId}`}
                                                    className="text-base sm:text-lg font-semibold text-[#1c2526]"
                                                >
                                                    {product.nom}
                                                </a>
                                                <p className="mt-2 text-xs sm:text-sm line-clamp-2 text-[#86868b]">
                                                    {product.description}
                                                </p>
                                                <p className="mt-2 sm:mt-3 text-lg sm:text-xl font-bold text-[#d4a017]">
                                                    $
                                                    {parseFloat(
                                                        product.prix
                                                    ).toFixed(2)}
                                                </p>
                                                <button
                                                    className="mt-3 sm:mt-4 w-full rounded-full px-4 py-2 text-sm font-medium flex items-center justify-center cursor-pointer bg-[#d4a017] hover:bg-[#facc15]"
                                                    onClick={() =>
                                                        handleAddToCart(product)
                                                    }
                                                >
                                                    <svg
                                                        className="mr-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7h-1M8 7h-.688M13 5v4m-2-2h4"
                                                        />
                                                    </svg>
                                                    Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                        {status === "succeeded" && pagination.last_page > 1 && (
                            <div className="mt-8 sm:mt-12 flex items-center justify-center animate-section">
                                <nav className="flex flex-wrap items-center space-x-2">
                                    <button
                                        onClick={() =>
                                            handlePageChange(
                                                pagination.current_page - 1
                                            )
                                        }
                                        disabled={pagination.current_page === 1}
                                        className="rounded-full p-2 border border-[#d1d5db] min-w-[40px]"
                                        style={{
                                            backgroundColor:
                                                pagination.current_page === 1
                                                    ? "#f5ecde"
                                                    : "#e8d9c2",
                                            color:
                                                pagination.current_page === 1
                                                    ? "#d1d5db"
                                                    : "#1c2526",
                                            cursor:
                                                pagination.current_page === 1
                                                    ? "not-allowed"
                                                    : "pointer",
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                    {getPageNumbers().map((page, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                typeof page === "number" &&
                                                handlePageChange(page)
                                            }
                                            className="rounded-full px-3 py-1 text-sm font-medium border border-[#d1d5db] min-w-[40px] my-1"
                                            style={{
                                                backgroundColor:
                                                    pagination.current_page ===
                                                    page
                                                        ? "#d4a017"
                                                        : "#f5ecde",
                                                color:
                                                    pagination.current_page ===
                                                    page
                                                        ? "#27272a"
                                                        : "#86868b",
                                                cursor:
                                                    typeof page === "number"
                                                        ? "pointer"
                                                        : "default",
                                            }}
                                            disabled={typeof page !== "number"}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() =>
                                            handlePageChange(
                                                pagination.current_page + 1
                                            )
                                        }
                                        disabled={
                                            pagination.current_page ===
                                            pagination.last_page
                                        }
                                        className="rounded-full p-2 border border-[#d1d5db] min-w-[40px]"
                                        style={{
                                            backgroundColor:
                                                pagination.current_page ===
                                                pagination.last_page
                                                    ? "#f5ecde"
                                                    : "#e8d9c2",
                                            color:
                                                pagination.current_page ===
                                                pagination.last_page
                                                    ? "#d1d5db"
                                                    : "#1c2526",
                                            cursor:
                                                pagination.current_page ===
                                                pagination.last_page
                                                    ? "not-allowed"
                                                    : "pointer",
                                        }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </nav>
                            </div>
                        )}

                        {status === "succeeded" &&
                            products &&
                            products.length > 0 && (
                                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-[#86868b] animate-section">
                                    <div>
                                        Showing{" "}
                                        {(pagination.current_page - 1) *
                                            pagination.per_page +
                                            1}{" "}
                                        to{" "}
                                        {Math.min(
                                            pagination.current_page *
                                                pagination.per_page,
                                            pagination.total
                                        )}{" "}
                                        of {pagination.total} dishes
                                    </div>
                                    <div className="mt-4 sm:mt-0 flex items-center">
                                        <span>Show</span>
                                        <select
                                            value={pagination.per_page}
                                            onChange={(e) => {
                                                setPagination((prev) => ({
                                                    ...prev,
                                                    per_page: Number(
                                                        e.target.value
                                                    ),
                                                    current_page: 1,
                                                }));
                                            }}
                                            className="mx-2 rounded-full px-3 py-1 text-xs sm:text-sm bg-[#f5ecde] text-[#1c2526] border border-[#d1d5db]"
                                        >
                                            <option value={12}>12</option>
                                            <option value={24}>24</option>
                                            <option value={48}>48</option>
                                            <option value={96}>96</option>
                                        </select>
                                        <span>per page</span>
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default memo(ProductsGrid);
