import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers, selectUser } from "../selectors/authSelectors.jsx";
import { updateUser, deleteUser } from "../features/usersSlice.jsx";
import { fetchOrders } from "../features/orderSlice.jsx";
import { useNavigate } from "react-router-dom";
import { FaUser, FaBox, FaTrash } from "react-icons/fa";

const UserProfile = () => {
    const dispatch = useDispatch();
    const userData = useSelector(selectUser);
    const navigate = useNavigate();
    const { error: usersError, status } = useSelector(getUsers);
    const ordersState = useSelector((state) => state.orders);
    const orders = ordersState.commandes || [];
    const ordersStatus = ordersState.status;
    const ordersError = ordersState.error;

    const [activeTab, setActiveTab] = useState("profile");
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        adresse: "",
        role: "user",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        if (userData) {
            setFormData({
                username: userData.username || "",
                email: userData.email || "",
                password: "",
                adresse: userData.adresse || "",
                role: userData.role || "user",
            });
        }
    }, [userData]);

    useEffect(() => {
        if (userData && ordersStatus === "idle") {
            dispatch(fetchOrders());
        }
    }, [userData, ordersStatus, dispatch]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (formData.username.length === 0 || formData.username.length > 50) {
            setError(
                "Username is required and must be less than 50 characters"
            );
            setLoading(false);
            return;
        }

        if (!formData.email.includes("@") || formData.email.length > 100) {
            setError(
                "Valid email address is required and must be less than 100 characters"
            );
            setLoading(false);
            return;
        }

        if (formData.password && formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            setLoading(false);
            return;
        }

        const updatePayload = {
            userId: userData.userId,
            username: formData.username,
            email: formData.email,
            password: formData.password || undefined,
            adresse: formData.adresse,
            role: formData.role,
        };

        dispatch(updateUser(updatePayload))
            .unwrap()
            .then(() => {
                setSuccess("Profile updated successfully");
                setError(null);
                setTimeout(() => setSuccess(null), 3000);
            })
            .catch((err) => {
                setError(err.message || "Failed to update profile");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleDeleteAccount = () => {
        if (
            window.confirm(
                "Are you sure you want to delete your account? This action cannot be undone."
            )
        ) {
            dispatch(deleteUser(userData.userId))
                .unwrap()
                .then(() => {
                    navigate("/");
                })
                .catch((err) => {
                    setError(err.message || "Failed to delete account");
                });
        }
    };

    const shopNavigate = () => {
        navigate("/store");
    };

    if (status === "loading" && !userData) {
        return (
            <div className="min-h-screen bg-main-500 flex justify-center items-center poppins">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-main-200" />
            </div>
        );
    }

    return (
        <div className="bg-main-100 min-h-screen poppins ">
            <header className="bg-main-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-extrabold ">My Account</h1>
                        <button
                            className="rounded-full bg-yellow-500 text-gray-900 font-medium py-2 px-6 hover:bg-yellow-400 hover: transition-all cursor-pointer"
                            onClick={shopNavigate}
                        >
                            Go To Store
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/4">
                        <div className="bg-main-200 rounded-2xl shadow-lg p-6">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="bg-gray-300 rounded-full h-32 w-32 flex items-center justify-center mb-4">
                                    <span className="text-4xl text-gray-600">
                                        {userData?.username
                                            ?.charAt(0)
                                            .toUpperCase() || "?"}
                                    </span>
                                </div>
                                <h2 className="mt-2 text-xl font-semibold ">
                                    {userData?.username}
                                </h2>
                                <p className="text-gray-700">
                                    Member since{" "}
                                    {userData?.createdAt
                                        ? new Date(
                                              userData.createdAt
                                          ).toLocaleDateString()
                                        : "N/A"}
                                </p>
                                <div className="mt-2 inline-flex items-center bg-main-200 px-3 py-1 rounded-full">
                                    <span className=" font-medium">
                                        {userData?.role?.toUpperCase() ||
                                            "USER"}
                                    </span>
                                </div>
                            </div>

                            <nav className="space-y-2">
                                {[
                                    {
                                        tab: "profile",
                                        label: "Profile Information",
                                        icon: FaUser,
                                    },
                                    {
                                        tab: "orders",
                                        label: "Order History",
                                        icon: FaBox,
                                    },
                                ].map(({ tab, label, icon: Icon }) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer ${
                                            activeTab === tab
                                                ? "bg-yellow-500  font-medium"
                                                : " hover:bg-yellow-500 "
                                        } transition-all`}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {label}
                                    </button>
                                ))}
                                <button
                                    onClick={handleDeleteAccount}
                                    className="w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 text-red-700 hover:bg-red-500 hover:text-gray-800 transition-all cursor-pointer"
                                >
                                    <FaTrash className="h-5 w-5" />
                                    Delete Account
                                </button>
                            </nav>
                        </div>
                    </div>

                    <div className="w-full md:w-3/4">
                        <div className="bg-main-200 rounded-2xl shadow-lg p-6">
                            {activeTab === "profile" && (
                                <div>
                                    <h3 className="text-xl font-bold  mb-6">
                                        Profile Information
                                    </h3>
                                    {error && (
                                        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-4">
                                            {error}
                                        </div>
                                    )}
                                    {success && (
                                        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-4">
                                            {success}
                                        </div>
                                    )}
                                    {usersError && (
                                        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-4">
                                            {usersError}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium  mb-1">
                                                    Username
                                                </label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-200"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium  mb-1">
                                                    Email Address
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-200"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium  mb-1">
                                                    Password{" "}
                                                    <span className="text-gray-500 text-xs">
                                                        (leave blank to keep
                                                        current)
                                                    </span>
                                                </label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    value={formData.password}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-200"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium  mb-1">
                                                    Address
                                                </label>
                                                <input
                                                    type="text"
                                                    name="adresse"
                                                    value={formData.adresse}
                                                    onChange={handleInputChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-main-200"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-6">
                                            <button
                                                type="submit"
                                                disabled={
                                                    loading ||
                                                    status === "loading"
                                                }
                                                className="rounded-full bg-yellow-500 px-6 py-2  font-medium hover:bg-yellow-400 hover: transition-all disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer"
                                            >
                                                {loading || status === "loading"
                                                    ? "Saving..."
                                                    : "Save Changes"}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === "orders" && (
                                <div>
                                    <h3 className="text-xl font-bold  mb-6">
                                        Order History
                                    </h3>
                                    {ordersError && (
                                        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-4">
                                            {ordersError}
                                        </div>
                                    )}
                                    {ordersStatus === "loading" ? (
                                        <div className="flex justify-center items-center py-8">
                                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-main-200" />
                                        </div>
                                    ) : orders.length > 0 ? (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div
                                                    key={order.commandeId}
                                                    className="border border-gray-300 rounded-lg p-4 bg-main-200"
                                                >
                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-3">
                                                        <div>
                                                            <span className="text-sm text-gray-700">
                                                                Order ID:{" "}
                                                            </span>
                                                            <span className="font-medium ">
                                                                {
                                                                    order.commandeId
                                                                }
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <span className="text-sm text-gray-700">
                                                                Date:{" "}
                                                            </span>
                                                            <span className="">
                                                                {new Date(
                                                                    order.dateCommande
                                                                ).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="mt-2">
                                                        <span className="text-sm text-gray-700">
                                                            Items:{" "}
                                                        </span>
                                                        <span className="">
                                                            {order.order_items
                                                                .map(
                                                                    (item) =>
                                                                        `${item.product.nom} (x${item.quantite})`
                                                                )
                                                                .join(", ") ||
                                                                "N/A"}
                                                        </span>
                                                    </div>

                                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mt-4">
                                                        <div className="mb-2 md:mb-0">
                                                            <span className="text-sm text-gray-700">
                                                                Total:{" "}
                                                            </span>
                                                            <span className="font-semibold ">
                                                                $
                                                                {parseFloat(
                                                                    order.totalPrix
                                                                ).toLocaleString()}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center">
                                                            <span
                                                                className={`px-3 py-2 text-sm rounded-full ${
                                                                    order.stat ===
                                                                    "delivered"
                                                                        ? "bg-green-600 text-green-900"
                                                                        : order.stat ===
                                                                          "shipped"
                                                                        ? "bg-violet-700 text-white"
                                                                        : order.stat ===
                                                                          "processing"
                                                                        ? "bg-green-100 text-green-300"
                                                                        : order.stat ===
                                                                          "pending"
                                                                        ? "bg-main-300 "
                                                                        : "bg-main-200 "
                                                                }`}
                                                            >
                                                                {order.stat
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                    order.stat.slice(
                                                                        1
                                                                    )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-700">
                                            You haven't placed any orders yet.
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default UserProfile;
