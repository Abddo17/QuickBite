import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    selectProducts,
    selectProductsStatus,
} from "../selectors/ProductsSelectors";
import { fetchProducts } from "../features/productsSlice";
import { useNavigate } from "react-router-dom";
import { topRightArrow } from "../constants";

const FeaturedFoods = () => {
    const dispatch = useDispatch();
    const products = useSelector(selectProducts);
    const status = useSelector(selectProductsStatus);
    const navigate = useNavigate();

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchProducts());
        }
    }, [status, dispatch]);

    const featuredProducts = products.filter((product) =>
        [
            "Grilled Chicken Sandwich",
            "Spaghetti Bolognese",
            "Veggie Supreme Pizza",
            "Philly Cheesesteak",
        ].includes(product.nom)
    );

    const handleProductClick = (produitId) => {
        navigate(`/product/${produitId}`);
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-main-100 flex justify-center items-center poppins">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-main-200" />
            </div>
        );
    }

    if (status === "failed") {
        return (
            <div className="bg-main-100 p-4 text-main-100">
                Failed to load products.
            </div>
        );
    }

    return (
        <div className="bg-main-100 py-12 poppins mb-[-90px]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-20">
                <h2 className="text-5xl font-bold text-gray-600 mb-8 text-center">
                    Featured Foods
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5">
                    {featuredProducts.slice(0, 4).map((product) => (
                        <div
                            key={product.produitId}
                            className={`relative rounded-3xl overflow-hidden shadow-lg h-64 sm:h-56 md:h-64 
                              ${
                                  product.produitId === 9 ||
                                  product.produitId === 12
                                      ? "lg:h-64 lg:w-full"
                                      : "lg:h-full "
                              } ${
                                product.produitId === 13
                                    ? "lg:mt-[-7rem] "
                                    : " "
                            }`}
                        >
                            <img
                                src={`http://localhost:8000${product.imageUrl}`}
                                alt={product.nom}
                                className={`w-full h-full object-cover ${
                                    product.produitId === 13 && "lg:h-[480px]"
                                }`}
                            />
                            <div className="absolute bottom-2 left-0 right-0 py-7 px-4 mx-2 backdrop-blur-md bg-gray-500/30 rounded-4xl">
                                <h3 className="text-main-100 font-normal text-xl">
                                    {product.nom}
                                </h3>
                            </div>
                            <button
                                onClick={() =>
                                    handleProductClick(product.produitId)
                                }
                                className="absolute bottom-7 right-4  rounded-full w-20 h-10 flex items-center justify-center transition-all"
                            >
                                <img
                                    src={topRightArrow}
                                    alt="Details"
                                    width={50}
                                    height={50}
                                    className="p-4 cursor-pointer bg-yellow-500 rounded-full hover:bg-main-300 transition"
                                />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FeaturedFoods;
