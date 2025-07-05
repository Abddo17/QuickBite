import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { gsap } from "gsap";
import { fetchProducts } from "../features/productsSlice";
import { fetchComments, submitComment } from "../features/commentsSlice";
import { backendBaseUrl } from "../API/axios";
import { addToCart } from "../features/cartSlice.jsx";
import {
    FaStar,
    FaShoppingCart,
    FaTruck,
    FaRedo,
    FaPercent,
} from "react-icons/fa";

const Details = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const {
        products,
        status: productStatus,
        error: productError,
    } = useSelector((state) => state.products);
    const {
        comments,
        status: commentStatus,
        error: commentError,
    } = useSelector((state) => state.comments);
    const [quantity, setQuantity] = useState(1);
    const [newComment, setNewComment] = useState({ rating: 0, content: "" });
    const product = products.find((p) => p.produitId.toString() === id);
    const commentsData = comments?.filter(
        (comment) => comment.produitId === product?.produitId
    );

    const averageRating =
        commentsData?.length > 0
            ? (
                  commentsData.reduce(
                      (sum, comment) => sum + (comment.rating || 0),
                      0
                  ) / commentsData.length
              ).toFixed(1)
            : 0;

    useEffect(() => {
        if (!product && productStatus !== "loading") {
            dispatch(fetchProducts({ id }))
                .unwrap()
                .catch((err) => console.error("Failed to fetch product:", err));
        }
        if (product) {
            dispatch(fetchComments(id))
                .unwrap()
                .catch((err) =>
                    console.error("Failed to fetch comments:", err)
                );
        }
    }, [dispatch, product, id, productStatus]);

    useEffect(() => {
        if (product) {
            gsap.fromTo(
                ".product-details",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
            );
            gsap.fromTo(
                ".comment-section",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    delay: 0.2,
                }
            );
        }
    }, [product]);

    const handleQuantityChange = (e) => {
        const value = parseInt(e.target.value) || 1;
        if (value <= (product?.stock || 0)) {
            setQuantity(value);
        }
    };

    const handleAddToCart = (item) => {
        dispatch(
            addToCart({
                id: item.produitId,
                name: item.nom,
                price: item.prix,
                image: item.imageUrl,
                quantity,
            })
        );
    };

    const handleCommentSubmit = (e) => {
        e.preventDefault();
        if (newComment.rating < 1 || newComment.rating > 5) {
            alert("Please select a rating between 1 and 5 stars.");
            return;
        }
        if (!newComment.content.trim()) {
            alert("Please enter a comment.");
            return;
        }
        dispatch(
            submitComment({
                produitId: id,
                content: newComment.content,
                rating: newComment.rating,
            })
        )
            .unwrap()
            .then(() => {
                setNewComment({ rating: 0, content: "" });
                dispatch(fetchComments(id));
            })
            .catch((err) => console.error("Failed to submit comment:", err));
    };

    if (productStatus === "loading" && !product) {
        return (
            <div
                className="container mx-auto px-4 py-16 flex justify-center items-center min-h-screen"
                style={{ backgroundColor: "var(--color-main-100)" }}
            >
                <div
                    className="h-12 w-12 animate-spin rounded-full border-4 border-t-4"
                    style={{
                        borderColor: "var(--color-gray-300)",
                        borderTopColor: "var(--color-main-300)",
                    }}
                />
            </div>
        );
    }
    if (productError && !product) {
        return (
            <div
                className="container mx-auto px-4 py-16 flex justify-center items-center min-h-screen"
                style={{ backgroundColor: "var(--color-main-100)" }}
            >
                <p style={{ color: "var(--color-gray-900)" }}>
                    Error: {productError.message}
                </p>
            </div>
        );
    }
    if (!product) {
        return (
            <div
                className="container mx-auto px-4 py-16 flex justify-center items-center min-h-screen"
                style={{ backgroundColor: "var(--color-main-100)" }}
            >
                <p style={{ color: "var(--color-gray-900)" }}>Dish not found</p>
            </div>
        );
    }

    return (
        <div
            className="py-16 min-h-screen"
            style={{ backgroundColor: "var(--color-main-100)" }}
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 product-details">
                    <div className="relative">
                        <img
                            src={`${backendBaseUrl}${product.imageUrl}`}
                            alt={product.nom}
                            className="w-full h-[500px] object-cover rounded-2xl shadow-lg transition-transform duration-300 hover:scale-105"
                        />
                        <div
                            className="absolute inset-0"
                            style={{
                                background:
                                    "linear-gradient(to bottom, rgba(245, 236, 222, 0.1), rgba(245, 236, 222, 0.3))",
                            }}
                        />
                    </div>

                    <div
                        className="p-8 rounded-2xl shadow-lg"
                        style={{ backgroundColor: "var(--color-main-200)" }}
                    >
                        <h1
                            className="text-4xl font-extrabold mb-4"
                            style={{ color: "var(--color-gray-900)" }}
                        >
                            {product.nom}
                        </h1>
                        <div
                            className="text-3xl font-bold mb-4"
                            style={{ color: "var(--color-main-300)" }}
                        >
                            ${parseFloat(product.prix).toFixed(2)}
                        </div>
                        <div className="flex items-center mb-4">
                            <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className={`w-5 h-5 ${
                                            star <= Math.round(averageRating)
                                                ? "text-yellow-500"
                                                : "text-gray-300"
                                        }`}
                                    />
                                ))}
                            </div>
                            <span
                                className="ml-2 text-sm"
                                style={{ color: "var(--color-gray)" }}
                            >
                                ({commentsData.length} reviews)
                            </span>
                        </div>

                        <ul
                            className="space-y-2 mb-6 text-lg"
                            style={{ color: "var(--color-gray)" }}
                        >
                            <li>
                                <span className="font-medium">Category:</span>{" "}
                                {product.category?.name || "N/A"}
                            </li>
                            <li>
                                <span className="font-medium">
                                    Description:
                                </span>{" "}
                                {product.description ||
                                    "No description available."}
                            </li>
                            <li>
                                <span className="font-medium">In Stock:</span>{" "}
                                {product.stock || 0} available
                            </li>
                        </ul>

                        <div className="flex items-center gap-4 mb-6 ">
                            <div className="flex items-center gap-2">
                                <label
                                    className="text-sm font-medium "
                                    style={{ color: "var(--color-gray)" }}
                                >
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max={product.stock || 0}
                                    value={quantity}
                                    onChange={handleQuantityChange}
                                    className="w-20 rounded-full border px-4 py-2 text-sm transition-all duration-200 focus:outline-none focus:ring-2 cursor-pointer"
                                    style={{
                                        backgroundColor:
                                            "var(--color-main-100)",
                                        borderColor: "var(--color-gray-300)",
                                        color: "var(--color-gray-900)",
                                        focus: {
                                            ringColor: "var(--color-main-300)",
                                        },
                                    }}
                                />
                            </div>
                            <button
                                className={`${
                                    product.stock < 1
                                        ? "bg-gray-300"
                                        : "bg-main-300 text-zinc"
                                }flex-1 rounded-full px-6 py-3 text-sm font-medium flex items-center justify-center transition-all duration-200 cursor-pointer hover:bg-yellow-500`}
                                disabled={product.stock < 1}
                                onClick={() => handleAddToCart(product)}
                            >
                                <FaShoppingCart className="mr-2 h-4 w-4" />
                                Add to Cart
                            </button>
                        </div>

                        <div
                            className="grid grid-cols-2 gap-4 text-sm"
                            style={{ color: "var(--color-gray)" }}
                        >
                            <div className="flex items-center gap-2">
                                <FaTruck
                                    className="h-5 w-5"
                                    style={{ color: "var(--color-main-300)" }}
                                />
                                Fast Delivery
                            </div>
                            <div className="flex items-center gap-2">
                                <FaRedo
                                    className="h-5 w-5"
                                    style={{ color: "var(--color-main-300)" }}
                                />
                                Easy Returns
                            </div>
                            <div className="flex items-center gap-2">
                                <FaPercent
                                    className="h-5 w-5"
                                    style={{ color: "var(--color-main-300)" }}
                                />
                                10% Off Next Order
                            </div>
                        </div>
                    </div>
                </div>

                <div
                    className="py-16 comment-section"
                    style={{ backgroundColor: "var(--color-main-100)" }}
                >
                    <h2
                        className="text-3xl font-bold text-center mb-12"
                        style={{ color: "var(--color-gray-900)" }}
                    >
                        Customer Reviews
                    </h2>

                    <div
                        className="max-w-2xl mx-auto p-8 rounded-2xl shadow-lg mb-12"
                        style={{ backgroundColor: "var(--color-main-200)" }}
                    >
                        <h3
                            className="text-xl font-semibold text-center mb-6"
                            style={{ color: "var(--color-gray-900)" }}
                        >
                            Share Your Feedback
                        </h3>
                        <form
                            onSubmit={handleCommentSubmit}
                            className="space-y-6"
                        >
                            <div>
                                <label
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: "var(--color-gray)" }}
                                >
                                    Rating
                                </label>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <FaStar
                                            key={star}
                                            onClick={() =>
                                                setNewComment((prev) => ({
                                                    ...prev,
                                                    rating: star,
                                                }))
                                            }
                                            className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
                                                star <= newComment.rating
                                                    ? "text-yellow-500"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label
                                    htmlFor="content"
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: "var(--color-gray)" }}
                                >
                                    Comment
                                </label>
                                <textarea
                                    id="content"
                                    value={newComment.content}
                                    onChange={(e) =>
                                        setNewComment((prev) => ({
                                            ...prev,
                                            content: e.target.value,
                                        }))
                                    }
                                    className="w-full h-24 p-4 rounded-lg border text-sm transition-all duration-200 focus:outline-none focus:ring-2"
                                    style={{
                                        backgroundColor:
                                            "var(--color-main-100)",
                                        borderColor: "var(--color-gray-300)",
                                        color: "var(--color-gray-900)",
                                        focus: {
                                            ringColor: "var(--color-main-300)",
                                        },
                                    }}
                                    placeholder="Share your thoughts about this dish..."
                                />
                            </div>
                            <button
                                type="submit"
                                className={`${
                                    commentStatus === "loading"
                                        ? "bg-gray-300"
                                        : "bg-main-300 text-zinc hover:bg-yellow-500"
                                } w-full rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 cursor-pointer`}
                                disabled={commentStatus === "loading"}
                            >
                                {commentStatus === "loading"
                                    ? "Submitting..."
                                    : "Submit Review"}
                            </button>
                            {commentError && (
                                <p
                                    className="text-sm text-center"
                                    style={{ color: "var(--color-gray-900)" }}
                                >
                                    Sign in to comment
                                </p>
                            )}
                        </form>
                    </div>

                    <div className="max-w-5xl mx-auto">
                        {commentStatus === "loading" &&
                        commentsData.length === 0 ? (
                            <p
                                className="text-center"
                                style={{ color: "var(--color-gray)" }}
                            >
                                Loading reviews...
                            </p>
                        ) : commentsData.length === 0 ? (
                            <p
                                className="text-center"
                                style={{ color: "var(--color-gray)" }}
                            >
                                No reviews yet. Be the first to share your
                                feedback!
                            </p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {commentsData.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className="p-6 rounded-2xl shadow-lg text-center"
                                        style={{
                                            backgroundColor:
                                                "var(--color-main-200)",
                                        }}
                                    >
                                        <div className="flex justify-center gap-1 mb-4">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    className={`w-5 h-5 ${
                                                        star <=
                                                        (comment.rating || 0)
                                                            ? "text-yellow-500"
                                                            : "text-gray-300"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                        <p
                                            className="text-sm mb-4"
                                            style={{
                                                color: "var(--color-gray)",
                                            }}
                                        >
                                            "
                                            {comment.content ||
                                                "No comment provided."}
                                            "
                                        </p>
                                        <p
                                            className="text-sm font-semibold"
                                            style={{
                                                color: "var(--color-gray-900)",
                                            }}
                                        >
                                            {comment.user?.name || "Anonymous"}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;
