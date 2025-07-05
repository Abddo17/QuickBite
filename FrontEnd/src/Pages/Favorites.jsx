import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { gsap } from "gsap";
import { removeFromFavorites } from "../features/favoritesSlice";
import { addToCart } from "../features/cartSlice";
import { backendBaseUrl } from "../API/axios.js";
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa";

const Favorites = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items: favorites } = useSelector((state) => state.favorites);

    useEffect(() => {
        if (favorites.length > 0) {
            gsap.fromTo(
                ".favorite-item",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out",
                }
            );
        }
    }, [favorites]);

    const handleAddToCart = (id) => {
        dispatch(addToCart({ id }));
    };

    const handleRemoveFromFavorites = (id) => {
        dispatch(removeFromFavorites(id));
    };

    return (
        <section className="min-h-screen bg-main-100 py-16 poppins">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-8">
                    Your Favorite Dishes
                </h2>

                <div className="mt-8">
                    {favorites.length === 0 ? (
                        <div className="rounded-2xl bg-main-200 p-8 text-center shadow-lg">
                            <FaHeart className="mx-auto h-16 w-16 text-gray mb-4" />
                            <p className="text-lg text-gray mb-4">
                                You have no favorite dishes.
                            </p>
                            <Link
                                to="/Store"
                                className="inline-block rounded-full bg-main-300 px-6 py-3 text-sm font-medium  transition-all hover:bg-yellow-500 hover:text-zinc"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {favorites.map((item) => (
                                <div
                                    key={item.id}
                                    className="favorite-item group rounded-2xl bg-main-200 p-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                                >
                                    <Link
                                        to={`/product/${item.id}`}
                                        className="relative  mb-6 flex h-48 items-center justify-center overflow-hidden rounded-lg bg-main-100"
                                    >
                                        <img
                                            className="max-h-full w-full max-w-full object-fit transition-transform duration-300 group-hover:scale-110"
                                            src={`${backendBaseUrl}/storage/${item.image}`}
                                            alt={item.name}
                                        />
                                    </Link>
                                    <div className="space-y-2">
                                        <Link
                                            to={`/product/${item.id}`}
                                            className="block text-lg font-semibold text-gray-900 hover:text-main-300"
                                        >
                                            {item.name}
                                        </Link>
                                        <p className="text-lg font-bold text-main-300">
                                            ${item.price.toLocaleString()}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleAddToCart(item.id)}
                                        className="mt-4 px-3 mx-1 rounded-full bg-main-300 py-3 text-sm font-medium text-zinc transition-all  cursor-pointer hover:bg-yellow-500"
                                    >
                                        <FaShoppingCart className="mr-2 inline h-4 w-4" />
                                        Add to Cart
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleRemoveFromFavorites(item.id)
                                        }
                                        className="mt-4 mx-3 px-3 rounded-full bg-red-500 py-3 text-sm font-medium text-zinc transition-all  cursor-pointer hover:bg-red-600"
                                    >
                                        <FaTrash className="mr-2 inline h-4 w-4" />
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {favorites.length > 0 && (
                    <div className="mt-12 flex justify-center">
                        <Link
                            to="/Store"
                            className="flex items-center gap-1 text-sm font-medium text-main-300 hover:text-primary-800"
                        >
                            Continue Shopping
                            <FaShoppingCart className="h-4 w-4" />
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Favorites;
