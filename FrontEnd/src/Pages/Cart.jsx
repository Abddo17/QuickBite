import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { gsap } from "gsap";
import {
    fetchCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    resetCartError,
} from "../features/cartSlice";
import {
    addToFavorites,
    removeFromFavorites,
} from "../features/favoritesSlice";
import { fetchProducts } from "../features/productsSlice";
import { backendBaseUrl } from "../API/axios.js";
import { selectIsAuthenticated } from "../selectors/authSelectors.jsx";
import {
    FaShoppingCart,
    FaHeart,
    FaTrash,
    FaMinus,
    FaPlus,
    FaLock,
} from "react-icons/fa";

const ShoppingCart = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(selectIsAuthenticated);
    const {
        items: cartItems,
        status,
        error,
    } = useSelector((state) => state.cart);
    const { products, status: productsStatus } = useSelector(
        (state) => state.products
    );
    const { items: favorites } = useSelector((state) => state.favorites);

    useEffect(() => {
        if (status === "idle" && isLoggedIn) {
            dispatch(fetchCart());
        }
        if (productsStatus === "idle") {
            dispatch(fetchProducts({}));
        }
    }, [status, productsStatus, dispatch, isLoggedIn]);

    useEffect(() => {
        if (status === "succeeded" && cartItems.length > 0) {
            gsap.fromTo(
                ".cart-item",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: "power3.out",
                }
            );
            gsap.fromTo(
                ".order-summary",
                { opacity: 0, x: 20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.6,
                    ease: "power3.out",
                    delay: 0.3,
                }
            );
        }
    }, [status, cartItems]);

    const recommendedProducts = products
        .filter(
            (product) =>
                !cartItems.some((item) => item.produitId === product.produitId)
        )
        .slice(0, 6)
        .map((product) => ({
            id: product.produitId,
            name: product.nom,
            description: product.description || "No description available.",
            originalPrice: Number(product.prix) + 100,
            salePrice: Number(product.prix),
            prix: Number(product.prix),
            image: product.imageUrl,
        }));

    const handleAddToCart = (item) => {
        dispatch(
            addToCart({
                id: item.id,
                name: item.name,
                price: item.prix,
                image: item.image,
            })
        );
    };

    const handleRemoveItem = (id) => {
        if (dispatch(removeFromCart(id))) {
            dispatch(fetchCart());
        }
    };

    const handleQuantityChange = (panierId, newQuantity) => {
        dispatch(updateQuantity({ panierId, quantity: newQuantity }));
        dispatch(fetchCart());
    };

    const handleToggleFavorites = (product) => {
        const isFavorite = favorites.some((fav) => fav.id === product.id);
        if (isFavorite) {
            dispatch(removeFromFavorites(product.id));
        } else {
            dispatch(
                addToFavorites({
                    id: product.id,
                    name: product.name,
                    price: product.prix,
                    image: product.image,
                })
            );
        }
    };

    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.prix * item.quantite,
        0
    );
    const savings = 5;
    const pickup = 0;
    const tax = 2.77;
    const total = subtotal - savings + pickup + tax;

    if (!isLoggedIn) {
        return (
            <section className="min-h-screen bg-main-100 py-16 poppins">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl bg-main-200 p-8 text-center shadow-lg">
                        <FaShoppingCart className="mx-auto h-16 w-16 text-gray mb-4" />
                        <p className="text-lg text-gray mb-4">
                            Please log in to view your cart.
                        </p>
                        <Link
                            to="/login"
                            className="inline-block rounded-full bg-primary-800 px-6 py-3 text-sm font-medium text-main-100 transition-all hover:bg-main-300 hover:text-zinc"
                        >
                            Log In
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    if (status === "loading") {
        return (
            <section className="min-h-screen bg-main-100 py-16 flex justify-center items-center poppins">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-main-300" />
            </section>
        );
    }

    if (error) {
        return (
            <section className="min-h-screen bg-main-100 py-16 poppins">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl bg-main-200 p-8 text-center shadow-lg">
                        <p className="text-lg text-gray-900 mb-4">{error}</p>
                        <button
                            onClick={() => dispatch(resetCartError())}
                            className="inline-block rounded-full bg-primary-800 px-6 py-3 text-sm font-medium text-main-100 transition-all hover:bg-main-300 hover:text-zinc"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-main-100 py-16 poppins">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-8">
                    Your Cart
                </h2>

                <div className="lg:flex lg:gap-8">
                    <div className="flex-1">
                        {cartItems.length === 0 ? (
                            <div className="rounded-2xl bg-main-200 p-8 text-center shadow-lg">
                                <FaShoppingCart className="mx-auto h-16 w-16 text-gray mb-4" />
                                <p className="text-lg text-gray mb-4">
                                    Your cart is empty.
                                </p>
                                <Link
                                    to="/Store"
                                    className="inline-block rounded-full bg-main-300 px-6 py-3 text-sm font-medium  transition-all hover:bg-yellow-500 hover:text-zinc"
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {cartItems.map((item, key) => {
                                    const isFavorite = favorites.some(
                                        (fav) => fav.id === item.produitId
                                    );
                                    return (
                                        <div
                                            key={key}
                                            className="cart-item rounded-2xl bg-main-200 p-6 shadow-lg transition-all hover:shadow-xl"
                                        >
                                            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                                                <div className="flex flex-1 items-center gap-4">
                                                    <Link
                                                        to={`/product/${item.produitId}`}
                                                        className="relative shrink-0 overflow-hidden rounded-xl"
                                                    >
                                                        <img
                                                            className="h-24 w-24 object-fit transition-transform group-hover:scale-105 md:h-23 md:w-28"
                                                            src={`${backendBaseUrl}/storage/${item.product.imageUrl}`}
                                                            alt={
                                                                item.product.nom
                                                            }
                                                        />
                                                    </Link>
                                                    <div className="min-w-0 flex-1 space-y-2">
                                                        <Link
                                                            to={`/product/${item.produitId}`}
                                                            className="text-lg font-semibold text-gray-900 hover:text-main-300"
                                                        >
                                                            {item.product.nom}
                                                        </Link>
                                                        <div className="flex flex-wrap gap-7 text-sm mt-2">
                                                            <button
                                                                onClick={() =>
                                                                    handleToggleFavorites(
                                                                        {
                                                                            id: item.produitId,
                                                                            name: item
                                                                                .product
                                                                                .nom,
                                                                            prix: item
                                                                                .product
                                                                                .prix,
                                                                            image: item
                                                                                .product
                                                                                .imageUrl,
                                                                        }
                                                                    )
                                                                }
                                                                className={`flex items-center font-medium transition-colors cursor-pointer ${
                                                                    isFavorite
                                                                        ? "text-yellow-500"
                                                                        : "text-gray hover:text-yellow-500"
                                                                }`}
                                                            >
                                                                <FaHeart className="mr-1.5 h-4 w-4" />
                                                                {isFavorite
                                                                    ? "Saved"
                                                                    : "Save"}
                                                            </button>

                                                            <button
                                                                onClick={() =>
                                                                    handleRemoveItem(
                                                                        item.panierId
                                                                    )
                                                                }
                                                                className="flex items-center text-gray hover:text-red-600 cursor-pointer"
                                                            >
                                                                <FaTrash className="mr-1.5 h-4 w-4" />
                                                                Remove
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
                                                    <div className="flex items-center rounded-full bg-main-100 p-1 shadow-inner">
                                                        <button
                                                            disabled={
                                                                item.quantite <=
                                                                1
                                                            }
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item.panierId,
                                                                    item.quantite -
                                                                        1
                                                                )
                                                            }
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-900 transition-colors hover:bg-main-300"
                                                        >
                                                            <FaMinus className="h-3 w-3" />
                                                        </button>
                                                        <input
                                                            type="text"
                                                            className="w-10 bg-transparent text-center text-sm font-medium text-gray-900 focus:outline-none"
                                                            value={
                                                                item.quantite
                                                            }
                                                            onChange={(e) =>
                                                                handleQuantityChange(
                                                                    item.panierId,
                                                                    parseInt(
                                                                        e.target
                                                                            .value
                                                                    ) || 1
                                                                )
                                                            }
                                                        />
                                                        <button
                                                            onClick={() =>
                                                                handleQuantityChange(
                                                                    item.panierId,
                                                                    item.quantite +
                                                                        1
                                                                )
                                                            }
                                                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-gray-900 transition-colors hover:bg-main-300"
                                                        >
                                                            <FaPlus className="h-3 w-3" />
                                                        </button>
                                                    </div>
                                                    <p className="text-lg font-bold text-gray-900">
                                                        $
                                                        {(
                                                            item.product.prix *
                                                            item.quantite
                                                        ).toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {cartItems.length > 0 && (
                            <div className="mt-12">
                                <h3 className="flex items-center gap-2 text-2xl font-bold text-gray-900">
                                    <FaShoppingCart className="h-6 w-6 text-main-300" />
                                    Recommended Dishes
                                </h3>
                                <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2">
                                    {recommendedProducts.map((product) => {
                                        const isFavorite = favorites.some(
                                            (fav) => fav.id === product.id
                                        );
                                        return (
                                            <div
                                                key={product.id}
                                                className="group rounded-2xl bg-main-200 py-6 shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
                                            >
                                                <Link
                                                    to={`/product/${product.id}`}
                                                    className="relative mb-6 h-48 overflow-hidden rounded-lg bg-main-100"
                                                >
                                                    <img
                                                        className="max-h-full max-w-full object-contain rounded-t-lg transition-transform duration-300 group-hover:scale-105 mt-[-24px]"
                                                        src={`${backendBaseUrl}${product.image}`}
                                                        alt={product.name}
                                                    />
                                                </Link>
                                                <div className="space-y-2 px-6 mt-2">
                                                    <Link
                                                        to={`/product/${product.id}`}
                                                        className="block text-lg text-center font-semibold text-gray-900 hover:text-main-300"
                                                    >
                                                        {product.name}
                                                    </Link>
                                                    <p className="line-clamp-2 text-sm text-center text-gray">
                                                        {product.description}
                                                    </p>
                                                    <p className="text-lg font-bold text-main-300 text-center">
                                                        $
                                                        {product.salePrice.toLocaleString()}
                                                    </p>
                                                    <button
                                                        onClick={() =>
                                                            handleAddToCart(
                                                                product
                                                            )
                                                        }
                                                        className="mt-2 w-full rounded-full bg-main-300 py-3 text-sm font-medium text-zinc transition-all hover:bg-yellow-500 hover:text-zinc cursor-pointer"
                                                    >
                                                        <FaShoppingCart className="mr-2 inline h-4 w-4" />
                                                        Add to Cart
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="order-summary mt-8 w-full max-w-md lg:mt-0">
                        <div className="sticky top-6 space-y-6">
                            <div className="rounded-2xl bg-main-200 shadow-lg">
                                <div className="bg-main-200 p-6">
                                    <p className="text-xl font-bold text-gray-900">
                                        Order Summary
                                    </p>
                                </div>
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <dl className="flex items-center justify-between gap-4">
                                            <dt className="text-sm text-gray">
                                                Subtotal
                                            </dt>
                                            <dd className="text-sm font-medium text-gray-900">
                                                ${subtotal.toLocaleString()}
                                            </dd>
                                        </dl>
                                        <dl className="flex items-center justify-between gap-4">
                                            <dt className="text-sm text-gray">
                                                Savings
                                            </dt>
                                            <dd className="text-sm font-medium text-yellow-500">
                                                -${savings.toLocaleString()}
                                            </dd>
                                        </dl>
                                        <dl className="flex items-center justify-between gap-4">
                                            <dt className="text-sm text-gray">
                                                Store Pickup
                                            </dt>
                                            <dd className="text-sm font-medium text-gray-900">
                                                ${pickup.toLocaleString()}
                                            </dd>
                                        </dl>
                                        <dl className="flex items-center justify-between gap-4">
                                            <dt className="text-sm text-gray">
                                                Tax
                                            </dt>
                                            <dd className="text-sm font-medium text-gray-900">
                                                ${tax.toLocaleString()}
                                            </dd>
                                        </dl>
                                        <dl className="flex items-center justify-between gap-4 border-t border-gray-300 pt-4">
                                            <dt className="text-lg font-bold text-gray-900">
                                                Total
                                            </dt>
                                            <dd className="text-lg font-bold text-gray-900">
                                                ${total.toLocaleString()}
                                            </dd>
                                        </dl>
                                    </div>
                                    <div className="mt-6 space-y-4">
                                        <button
                                            onClick={() =>
                                                navigate("/checkout")
                                            }
                                            className="w-full rounded-full bg-main-300 px-5 py-3 text-sm font-medium text-zinc transition-all hover:bg-yellow-500 hover:text-zinc cursor-pointer"
                                        >
                                            Proceed to Checkout
                                        </button>
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-sm text-gray">
                                                or
                                            </span>
                                            <button
                                                onClick={() =>
                                                    navigate("/Store")
                                                }
                                                className="flex items-center gap-1 text-sm font-medium text-main-300 hover:text-primary-800 cursor-pointer"
                                            >
                                                Continue Shopping
                                                <FaPlus className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {cartItems.length > 0 && (
                                <div className="rounded-2xl bg-main-100 p-6 shadow-lg">
                                    <div className="flex items-start gap-3">
                                        <div className="rounded-full bg-main-300 p-2 text-zinc">
                                            <FaLock className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">
                                                Secure Checkout
                                            </h4>
                                            <p className="mt-1 text-xs text-gray">
                                                Your payment information is
                                                protected with industry-standard
                                                encryption
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ShoppingCart;
