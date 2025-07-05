import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import api from "../API/axios.js";
import { FaShoppingCart } from "react-icons/fa";
import { selectIsAuthenticated } from "../selectors/authSelectors.jsx";

const Orders = () => {
    const dispatch = useDispatch();
    const isLoggedIn = useSelector(selectIsAuthenticated);
    const [orders, setOrders] = useState([]);
    const [status, setStatus] = useState("idle");
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isLoggedIn && status === "idle") {
            const fetchOrders = async () => {
                setStatus("loading");
                try {
                    const response = await api.get("/commandes");
                    setOrders(response.data);
                    setStatus("succeeded");
                } catch (err) {
                    setError(
                        err.response?.data?.message || "Failed to fetch orders"
                    );
                    setStatus("failed");
                }
            };
            fetchOrders();
        }
    }, [isLoggedIn, status]);

    useEffect(() => {
        if (status === "succeeded" && orders.length > 0) {
            gsap.fromTo(
                ".order-item",
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
    }, [status, orders]);

    if (!isLoggedIn) {
        return (
            <section className="min-h-screen bg-main-100 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl bg-main-200 p-8 text-center shadow-lg">
                        <FaShoppingCart className="mx-auto h-16 w-16 text-gray mb-4" />
                        <p className="text-lg text-gray mb-4">
                            Please log in to view your orders.
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
            <section className="min-h-screen bg-main-100 py-16 flex justify-center items-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-main-300" />
            </section>
        );
    }

    if (error) {
        return (
            <section className="min-h-screen bg-main-100 py-16">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl bg-main-200 p-8 text-center shadow-lg">
                        <p className="text-lg text-gray-900 mb-4">{error}</p>
                        <button
                            onClick={() => setStatus("idle")}
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
        <section className="min-h-screen bg-main-100 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-8">
                    Your Orders
                </h2>
                {orders.length === 0 ? (
                    <div className="rounded-2xl bg-main-200 p-8 text-center shadow-lg">
                        <FaShoppingCart className="mx-auto h-16 w-16 text-gray mb-4" />
                        <p className="text-lg text-gray mb-4">
                            You have no orders.
                        </p>
                        <Link
                            to="/Store"
                            className="inline-block rounded-full bg-primary-800 px-6 py-3 text-sm font-medium text-main-100 transition-all hover:bg-main-300 hover:text-zinc"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div
                                key={order.commandeId}
                                className="order-item rounded-2xl bg-main-200 p-6 shadow-lg"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <p className="text-lg font-semibold text-gray-900">
                                        Order #{order.commandeId}
                                    </p>
                                    <p className="text-sm text-gray capitalize">
                                        Status: {order.stat}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    {order.orderItems.map((item) => (
                                        <div
                                            key={item.produitId}
                                            className="flex items-center gap-4"
                                        >
                                            <img
                                                className="h-16 w-16 object-contain rounded-lg"
                                                src={`${backendBaseUrl}${item.product.imageUrl}`}
                                                alt={item.product.nom}
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {item.product.nom}
                                                </p>
                                                <p className="text-sm text-gray">
                                                    Quantity: {item.quantite}
                                                </p>
                                                <p className="text-sm font-bold text-main-300">
                                                    $
                                                    {(
                                                        item.prix *
                                                        item.quantite
                                                    ).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-lg font-bold text-gray-900 mt-4">
                                    Total: ${order.totalPrix.toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
                {orders.length > 0 && (
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

export default Orders;
