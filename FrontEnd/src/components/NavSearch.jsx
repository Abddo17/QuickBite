import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProducts,
    clearSearchResults,
} from "../features/productsSlice.jsx"; // Update with your actual path
import { closeIcon, searchImg } from "../constants/index.js";
import { backendBaseUrl } from "../API/axios.js";
import { Link, useNavigate } from "react-router-dom";

export const NavSearch = ({ setSearchBar }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { products, status, pagination } = useSelector(
        (state) => state.products
    );
    const [searchQuery, setSearchQuery] = useState("");
    const [showResults, setShowResults] = useState(false);

    // Create a properly memoized debounced search function
    const debouncedSearch = useCallback(
        (() => {
            let timeoutId = null;

            return (query) => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                return new Promise((resolve) => {
                    timeoutId = setTimeout(() => {
                        if (query.trim().length >= 2) {
                            dispatch(fetchProducts({ search: query }));
                            setShowResults(true);
                        } else {
                            dispatch(clearSearchResults());
                            setShowResults(false);
                        }
                        resolve();
                    }, 500);
                });
            };
        })(),
        [dispatch]
    );

    // Handle search input changes
    const handleSearchChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim().length < 2 && showResults) {
            dispatch(clearSearchResults());
            setShowResults(false);
        }
    };

    // Effect to trigger search after typing stops
    useEffect(() => {
        if (searchQuery.trim().length >= 2) {
            debouncedSearch(searchQuery);
        }

        // Cleanup function to cancel any pending debounced calls
        return () => {
            debouncedSearch.cancel?.();
        };
    }, [searchQuery, debouncedSearch]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim().length >= 2) {
            dispatch(
                fetchProducts({
                    search: searchQuery,
                    per_page: pagination.per_page,
                    sort_by: pagination.sort_by,
                    sort_dir: pagination.sort_dir,
                })
            );
            setShowResults(true);
        }
    };

    const handleProductClick = (productId) => {
        navigate(`/product/${productId}`);
        setSearchBar(false);
    };

    const closeSearch = () => {
        setSearchBar(false);
        setShowResults(false);
        setSearchQuery("");
        dispatch(clearSearchResults());
    };

    useEffect(() => {
        return () => {
            // Trigger a clean fetch
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
        <>
            {/* Desktop Search with Results Overlay */}
            <div className="fixed inset-0 z-[1000] max-sm:hidden flex items-start justify-center bg-black/70 backdrop-blur-sm">
                <div className="w-full max-w-4xl mx-4 mt-20">
                    <form onSubmit={handleSearchSubmit} className="relative">
                        <input
                            type="text"
                            placeholder="Search by name, description ..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="border border-gray-600 w-full py-3 px-4 pr-12 rounded-t-2xl text-white bg-black focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-400 shadow-md"
                            autoFocus
                        />
                        <button
                            type="submit"
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            <img
                                src={searchImg}
                                alt="search"
                                width={25}
                                height={25}
                                className="opacity-80 hover:opacity-100 transition-opacity duration-200"
                            />
                        </button>
                    </form>

                    {/* Search Results */}
                    {showResults && (
                        <div className="bg-black border-x border-b border-gray-600 rounded-b-2xl max-h-[70vh] overflow-y-auto shadow-lg">
                            {status === "loading" ? (
                                <div className="flex justify-center p-6">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                                </div>
                            ) : products.length > 0 ? (
                                <div>
                                    <div className="p-3 bg-black text-white text-lg">
                                        {pagination.total} results found
                                    </div>
                                    <ul>
                                        {products.map((product) => (
                                            <li
                                                key={product.produitId}
                                                className="border-b border-gray-700 last:border-none hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                                                onClick={() =>
                                                    handleProductClick(
                                                        product.produitId
                                                    )
                                                }
                                            >
                                                <div className="flex items-center p-3">
                                                    {product.imageUrl && (
                                                        <div className=" h-16 mr-4 flex-shrink-0">
                                                            <img
                                                                src={`${backendBaseUrl}${product.imageUrl}`}
                                                                alt={
                                                                    product.nom
                                                                }
                                                                className="w-full h-full object-cover rounded-md"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-grow">
                                                        <h4 className="text-white font-medium">
                                                            {product.nom}
                                                        </h4>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            <span className="text-yellow-500 font-medium">
                                                                ${product.prix}
                                                            </span>
                                                            {product.brand && (
                                                                <span className="text-gray-400 text-sm">
                                                                    {
                                                                        product.brand
                                                                    }
                                                                </span>
                                                            )}
                                                            {product.color && (
                                                                <div className="flex items-center">
                                                                    <span
                                                                        className="inline-block w-3 h-3 rounded-full mr-1"
                                                                        style={{
                                                                            backgroundColor:
                                                                                product.color.toLowerCase(),
                                                                        }}
                                                                    ></span>
                                                                    <span className="text-gray-400 text-sm">
                                                                        {
                                                                            product.color
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Pagination Controls */}
                                    {pagination.last_page > 1 && (
                                        <div className="flex justify-between items-center p-3 bg-gray-700">
                                            <button
                                                className={`px-3 py-1 rounded ${
                                                    pagination.current_page > 1
                                                        ? "bg-gray-600 hover:bg-gray-500"
                                                        : "bg-gray-800 cursor-not-allowed"
                                                }`}
                                                disabled={
                                                    pagination.current_page <= 1
                                                }
                                                onClick={() =>
                                                    dispatch(
                                                        fetchProducts({
                                                            search: searchQuery,
                                                            page:
                                                                pagination.current_page -
                                                                1,
                                                            per_page:
                                                                pagination.per_page,
                                                        })
                                                    )
                                                }
                                            >
                                                Previous
                                            </button>
                                            <span className="text-gray-300 text-sm">
                                                Page {pagination.current_page}{" "}
                                                of {pagination.last_page}
                                            </span>
                                            <button
                                                className={`px-3 py-1 rounded ${
                                                    pagination.current_page <
                                                    pagination.last_page
                                                        ? "bg-gray-600 hover:bg-gray-500"
                                                        : "bg-gray-800 cursor-not-allowed"
                                                }`}
                                                disabled={
                                                    pagination.current_page >=
                                                    pagination.last_page
                                                }
                                                onClick={() =>
                                                    dispatch(
                                                        fetchProducts({
                                                            search: searchQuery,
                                                            page:
                                                                pagination.current_page +
                                                                1,
                                                            per_page:
                                                                pagination.per_page,
                                                        })
                                                    )
                                                }
                                            >
                                                Next
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ) : searchQuery.trim().length >= 2 ? (
                                <div className="p-6 text-center text-gray-400">
                                    No products found matching "{searchQuery}"
                                </div>
                            ) : null}
                        </div>
                    )}
                </div>

                <img
                    src={closeIcon}
                    alt="close"
                    width={40}
                    height={40}
                    className="absolute top-4 right-4 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                    onClick={closeSearch}
                />
            </div>

            {/* Mobile Search Input */}
            <div className="sm:hidden w-full relative">
                <input
                    type="search"
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-11/12 mx-auto my-6 text-center text-white bg-gray-800 border border-gray-600 rounded-full py-2.5 focus:outline-none focus:ring-2 focus:ring-gray-400 placeholder-gray-400"
                />

                {/* Mobile Search Results */}
                {showResults && (
                    <div className="absolute z-20 inset-x-4 top-16 bg-gray-800 border border-gray-600 rounded-xl max-h-[80vh] overflow-y-auto shadow-lg">
                        {status === "loading" ? (
                            <div className="flex justify-center p-6">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
                            </div>
                        ) : products.length > 0 ? (
                            <div>
                                <div className="p-2 bg-gray-700 text-gray-300 text-sm text-center">
                                    {pagination.total} results found
                                </div>
                                <ul>
                                    {products.map((product) => (
                                        <li
                                            key={product.produitId}
                                            className="border-b border-gray-700 last:border-none hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                                            onClick={() =>
                                                handleProductClick(
                                                    product.produitId
                                                )
                                            }
                                        >
                                            <div className="flex items-center p-2">
                                                {product.imageUrl && (
                                                    <div className="w-12 h-12 mr-3 flex-shrink-0">
                                                        <img
                                                            src={`${backendBaseUrl}${product.imageUrl}`}
                                                            alt={product.nom}
                                                            className="w-full h-full object-cover rounded-md"
                                                        />
                                                    </div>
                                                )}
                                                <div className="flex-grow">
                                                    <h4 className="text-white text-sm">
                                                        {product.nom}
                                                    </h4>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-green-400 text-sm font-medium">
                                                            ${product.prix}
                                                        </span>
                                                        {product.brand && (
                                                            <span className="text-gray-400 text-xs">
                                                                {product.brand}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* Simplified Mobile Pagination */}
                                {pagination.last_page > 1 && (
                                    <div className="flex justify-between items-center p-2 bg-gray-700 text-xs">
                                        <button
                                            className={`px-2 py-1 rounded ${
                                                pagination.current_page > 1
                                                    ? "bg-gray-600"
                                                    : "bg-gray-800 opacity-50"
                                            }`}
                                            disabled={
                                                pagination.current_page <= 1
                                            }
                                            onClick={() =>
                                                dispatch(
                                                    fetchProducts({
                                                        search: searchQuery,
                                                        page:
                                                            pagination.current_page -
                                                            1,
                                                        per_page:
                                                            pagination.per_page,
                                                    })
                                                )
                                            }
                                        >
                                            Prev
                                        </button>
                                        <span className="text-gray-300">
                                            {pagination.current_page}/
                                            {pagination.last_page}
                                        </span>
                                        <button
                                            className={`px-2 py-1 rounded ${
                                                pagination.current_page <
                                                pagination.last_page
                                                    ? "bg-gray-600"
                                                    : "bg-gray-800 opacity-50"
                                            }`}
                                            disabled={
                                                pagination.current_page >=
                                                pagination.last_page
                                            }
                                            onClick={() =>
                                                dispatch(
                                                    fetchProducts({
                                                        search: searchQuery,
                                                        page:
                                                            pagination.current_page +
                                                            1,
                                                        per_page:
                                                            pagination.per_page,
                                                    })
                                                )
                                            }
                                        >
                                            Next
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-gray-400 text-sm">
                                No products found matching "{searchQuery}"
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default NavSearch;
