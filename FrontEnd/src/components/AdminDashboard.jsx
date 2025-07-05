import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchProducts,
    addProduct,
    updateProduct,
    deleteProduct,
} from "../features/productsSlice";
import {
    fetchCategories,
    addCategory,
    deleteCategory,
} from "../features/categoriesSlice";
import {
    fetchUsers,
    addUser,
    updateUser,
    deleteUser,
} from "../features/usersSlice";
import { fetchOrders, updateCommandeStatus } from "../features/orderSlice";
import { backendBaseUrl } from "../api/axios";

const AdminDashboard = () => {
    const dispatch = useDispatch();
    const { products, status: productsStatus } = useSelector(
        (state) => state.products
    );
    const { categories, status: categoriesStatus } = useSelector(
        (state) => state.categories
    );
    const { users, status: usersStatus } = useSelector((state) => state.users);
    const {
        commandes,
        status: commandesStatus,
        error: commandesError,
    } = useSelector((state) => state.orders);

    const [activeTab, setActiveTab] = useState("products");
    const [newProduct, setNewProduct] = useState({
        nom: "",
        description: "",
        prix: "",
        stock: "",
        categoryId: "",
        type: "",
        size: "",
        image: null,
    });
    const [newUser, setNewUser] = useState({
        username: "",
        email: "",
        password: "",
        adresse: "",
        role: "user",
    });
    const [newCategory, setNewCategory] = useState("");
    const [editingProduct, setEditingProduct] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (productsStatus === "idle" && activeTab === "products") {
            dispatch(fetchProducts());
        }
        if (categoriesStatus === "idle" && activeTab === "products") {
            dispatch(fetchCategories());
        }
        if (usersStatus === "idle" && activeTab === "users") {
            dispatch(fetchUsers());
        }
        if (commandesStatus === "idle" && activeTab === "commandes") {
            dispatch(fetchOrders());
        }
    }, [
        productsStatus,
        categoriesStatus,
        usersStatus,
        commandesStatus,
        activeTab,
        dispatch,
    ]);

    // Product Handlers
    const handleAddProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nom", newProduct.nom);
        formData.append("description", newProduct.description);
        formData.append("prix", newProduct.prix);
        formData.append("stock", newProduct.stock);
        formData.append("categoryId", newProduct.categoryId);
        if (newProduct.type) formData.append("type", newProduct.type);
        if (newProduct.size) formData.append("size", newProduct.size);
        if (newProduct.image) formData.append("image", newProduct.image);

        try {
            await dispatch(addProduct(formData)).unwrap();
            setNewProduct({
                nom: "",
                description: "",
                prix: "",
                stock: "",
                categoryId: "",
                type: "",
                size: "",
                image: null,
            });
            setMessage("Product added successfully!");
        } catch (error) {
            setMessage(
                "Error adding product: " + (error.message || "Unknown error")
            );
        }
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("nom", newProduct.nom);
        formData.append("description", newProduct.description);
        formData.append("prix", newProduct.prix);
        formData.append("stock", newProduct.stock);
        formData.append("categoryId", newProduct.categoryId);
        if (newProduct.type) formData.append("type", newProduct.type);
        if (newProduct.size) formData.append("size", newProduct.size);
        if (newProduct.image) formData.append("image", newProduct.image);
        formData.append("_method", "PUT");

        try {
            await dispatch(
                updateProduct({
                    produitId: editingProduct.produitId,
                    formData,
                })
            ).unwrap();
            setEditingProduct(null);
            setNewProduct({
                nom: "",
                description: "",
                prix: "",
                stock: "",
                categoryId: "",
                type: "",
                size: "",
                image: null,
            });
            setMessage("Product updated successfully!");
        } catch (error) {
            setMessage(
                "Error updating product: " + (error.message || "Unknown error")
            );
        }
    };

    const handleDeleteProduct = (produitId) => {
        dispatch(deleteProduct(produitId));
        setMessage("Product deleted successfully!");
    };

    // User Handlers
    const handleAddUser = async (e) => {
        e.preventDefault();
        const userData = {
            username: newUser.username,
            email: newUser.email,
            password: newUser.password,
            adresse: newUser.adresse,
            role: newUser.role,
        };

        try {
            await dispatch(addUser(userData)).unwrap();
            setNewUser({
                username: "",
                email: "",
                password: "",
                adresse: "",
                role: "user",
            });
            setMessage("User added successfully!");
        } catch (error) {
            setMessage(
                "Error adding user: " + (error.message || "Unknown error")
            );
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const userData = {
            username: newUser.username,
            email: newUser.email,
            adresse: newUser.adresse,
            role: newUser.role,
            ...(newUser.password && { password: newUser.password }),
        };

        try {
            await dispatch(
                updateUser({ userId: editingUser.userId, data: userData })
            ).unwrap();
            setEditingUser(null);
            setNewUser({
                username: "",
                email: "",
                password: "",
                adresse: "",
                role: "user",
            });
            setMessage("User updated successfully!");
        } catch (error) {
            setMessage(
                "Error updating user: " + (error.message || "Unknown error")
            );
        }
    };

    const handleDeleteUser = (userId) => {
        dispatch(deleteUser(userId));
        setMessage("User deleted successfully!");
    };

    // Category Handlers
    const handleAddCategory = async (e) => {
        e.preventDefault();
        try {
            await dispatch(addCategory({ name: newCategory })).unwrap();
            setNewCategory("");
            setMessage("Category added successfully!");
        } catch (error) {
            setMessage(
                "Error adding category: " + (error.message || "Unknown error")
            );
        }
    };

    const handleDeleteCategory = (categoryId) => {
        dispatch(deleteCategory(categoryId));
        setMessage("Category deleted successfully!");
    };

    // Order Status Update Handler
    const handleUpdateCommandeStatus = async (commandeId, stat) => {
        try {
            await dispatch(updateCommandeStatus({ commandeId, stat })).unwrap();
            setMessage("Order status updated successfully!");
        } catch (error) {
            setMessage(
                "Error updating order status: " +
                    (error.message || "Unknown error")
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#FAF3DD] flex font-poppins">
            {/* Sidebar */}
            <aside className="w-72 bg-gradient-to-b from-[#0D3B66] to-[#1B5E91] text-white p-6 flex-shrink-0 shadow-2xl">
                <h2 className="text-3xl font-bold mb-10 tracking-tight text-[#F4A261]">
                    QuickBite Admin
                </h2>
                <nav>
                    <ul>
                        {["products", "users", "commandes"].map((tab) => (
                            <li key={tab}>
                                <button
                                    onClick={() => setActiveTab(tab)}
                                    className={`w-full text-left py-3 px-4 rounded-2xl mb-3 text-sm font-semibold transition-all duration-300 ${
                                        activeTab === tab
                                            ? "bg-[#F4A261] text-[#0D3B66] shadow-md"
                                            : "hover:bg-[#1B5E91] hover:text-[#F4A261]"
                                    }`}
                                >
                                    {tab === "products"
                                        ? "Menu Items"
                                        : tab === "users"
                                        ? "Users"
                                        : "Orders"}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-auto">
                <div className="max-w-6xl mx-auto">
                    {/* Message */}
                    {message && (
                        <div
                            className={`p-4 rounded-2xl mb-6 text-center animate-fade-in shadow-md ${
                                message.includes("Error")
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                            }`}
                        >
                            <p className="font-semibold text-[#2F2F2F]">
                                {message}
                            </p>
                        </div>
                    )}

                    {/* Products Tab */}
                    {activeTab === "products" && (
                        <>
                            {/* Add Category Section */}
                            <section className="bg-white rounded-3xl shadow-lg p-8 mb-8 transition-all duration-300 hover:shadow-xl">
                                <h3 className="text-2xl font-bold text-[#0D3B66] mb-6">
                                    Add Menu Category
                                </h3>
                                <form
                                    onSubmit={handleAddCategory}
                                    className="flex flex-col sm:flex-row gap-4"
                                >
                                    <input
                                        type="text"
                                        value={newCategory}
                                        onChange={(e) =>
                                            setNewCategory(e.target.value)
                                        }
                                        placeholder="Category Name (e.g., Desserts)"
                                        required
                                        className="flex-1 p-3 rounded-2xl bg-[#FAF3DD] text-[#2F2F2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261] transition-all duration-300"
                                    />
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-[#F4A261] text-[#0D3B66] rounded-2xl hover:bg-[#E76F51] focus:ring-4 focus:ring-[#F4A261]/50 transition-all duration-300 font-semibold"
                                    >
                                        Add Category
                                    </button>
                                </form>
                            </section>

                            {/* Categories List */}
                            <section className="bg-white rounded-3xl shadow-lg p-8 mb-8 transition-all duration-300 hover:shadow-xl">
                                <h3 className="text-2xl font-bold text-[#0D3B66] mb-6">
                                    Menu Categories
                                </h3>
                                {categories.length === 0 ? (
                                    <p className="text-[#2F2F2F]/70">
                                        No categories available.
                                    </p>
                                ) : (
                                    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {categories.map((category) => (
                                            <li
                                                key={category.categoryId}
                                                className="flex items-center justify-between p-4 bg-[#FAF3DD] rounded-2xl hover:bg-[#F4A261]/20 transition-all duration-300 transform hover:scale-[1.02]"
                                            >
                                                <span className="text-[#2F2F2F] font-semibold">
                                                    {category.name}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleDeleteCategory(
                                                            category.categoryId
                                                        )
                                                    }
                                                    className="px-4 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all duration-300 font-semibold"
                                                >
                                                    Delete
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </section>

                            {/* Add/Edit Product Section */}
                            <section className="bg-white rounded-3xl shadow-lg p-8 mb-8 transition-all duration-300 hover:shadow-xl">
                                <h3 className="text-2xl font-bold text-[#0D3B66] mb-6">
                                    {editingProduct
                                        ? "Edit Menu Item"
                                        : "Add Menu Item"}
                                </h3>
                                <form
                                    onSubmit={
                                        editingProduct
                                            ? handleUpdateProduct
                                            : handleAddProduct
                                    }
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <div>
                                        <label className="block text-sm font-semibold text-[#2F2F2F] mb-2">
                                            Dish Name
                                        </label>
                                        <input
                                            type="text"
                                            value={newProduct.nom}
                                            onChange={(e) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    nom: e.target.value,
                                                })
                                            }
                                            required
                                            className="w-full p-3 rounded-2xl bg-[#FAF3DD] text-[#2F2F2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261] transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#2F2F2F] mb-2">
                                            Price ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={newProduct.prix}
                                            onChange={(e) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    prix: e.target.value,
                                                })
                                            }
                                            required
                                            className="w-full p-3 rounded-2xl bg-[#FAF3DD] text-[#2F2F2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261] transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#2F2F2F] mb-2">
                                            Stock
                                        </label>
                                        <input
                                            type="number"
                                            value={newProduct.stock}
                                            onChange={(e) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    stock: e.target.value,
                                                })
                                            }
                                            required
                                            className="w-full p-3 rounded-2xl bg-[#FAF3DD] text-[#2F2F2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261] transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#2F2F2F] mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={newProduct.categoryId}
                                            onChange={(e) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    categoryId: e.target.value,
                                                })
                                            }
                                            required
                                            className="w-full p-3 rounded-2xl bg-[#FAF3DD] text-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#F4A261] transition-all duration-300"
                                        >
                                            <option value="" disabled>
                                                Select Category
                                            </option>
                                            {categories.map((category) => (
                                                <option
                                                    key={category.categoryId}
                                                    value={category.categoryId}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-[#2F2F2F] mb-2">
                                            Description
                                        </label>
                                        <textarea
                                            value={newProduct.description}
                                            onChange={(e) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    description: e.target.value,
                                                })
                                            }
                                            className="w-full p-3 rounded-2xl bg-[#FAF3DD] text-[#2F2F2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261] transition-all duration-300"
                                            rows="4"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#2F2F2F] mb-2">
                                            Type (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            value={newProduct.type}
                                            onChange={(e) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    type: e.target.value,
                                                })
                                            }
                                            placeholder="e.g., Vegan, Spicy"
                                            className="w-full p-3 rounded-2xl bg-[#FAF3DD] text-[#2F2F2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261] transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#2F2F2F] mb-2">
                                            Portion Size
                                        </label>
                                        <input
                                            type="text"
                                            value={newProduct.size}
                                            onChange={(e) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    size: e.target.value,
                                                })
                                            }
                                            placeholder="e.g., Small, Large"
                                            className="w-full p-3 rounded-2xl bg-[#FAF3DD] text-[#2F2F2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261] transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#2F2F2F] mb-2">
                                            Image
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                setNewProduct({
                                                    ...newProduct,
                                                    image: e.target.files[0],
                                                })
                                            }
                                            className="w-full p-3 rounded-2xl bg-[#FAF3DD] text-[#2F2F2F] file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:bg-[#F4A261] file:text-[#0D3B66] hover:file:bg-[#E76F51] transition-all duration-300"
                                        />
                                    </div>
                                    <div className="md:col-span-2 flex gap-4">
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-[#F4A261] text-[#0D3B66] rounded-2xl hover:bg-[#E76F51] focus:ring-4 focus:ring-[#F4A261]/50 transition-all duration-300 font-semibold"
                                        >
                                            {editingProduct
                                                ? "Update Menu Item"
                                                : "Add Menu Item"}
                                        </button>
                                        {editingProduct && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingProduct(null);
                                                    setNewProduct({
                                                        nom: "",
                                                        description: "",
                                                        prix: "",
                                                        stock: "",
                                                        categoryId: "",
                                                        type: "",
                                                        size: "",
                                                        image: null,
                                                    });
                                                }}
                                                className="px-6 py-3 bg-[#2F2F2F] text-white rounded-2xl hover:bg-[#4B4B4B] transition-all duration-300 font-semibold"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </section>

                            {/* Products List */}
                            <section className="bg-white rounded-3xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
                                <h3 className="text-2xl font-bold text-[#0D3B66] mb-6">
                                    Menu Items
                                </h3>
                                {products.length === 0 ? (
                                    <p className="text-[#2F2F2F]/70">
                                        No menu items available.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {products.map((product) => (
                                            <div
                                                key={product.produitId}
                                                className="p-4 bg-[#FAF3DD] rounded-2xl hover:bg-[#F4A261]/20 transition-all duration-300 transform hover:scale-[1.02] shadow-sm"
                                            >
                                                <div className="flex items-center gap-4">
                                                    {product.imageUrl && (
                                                        <img
                                                            src={
                                                                backendBaseUrl +
                                                                product.imageUrl
                                                            }
                                                            alt={product.nom}
                                                            className="w-16 h-16 object-cover rounded-2xl"
                                                            loading="lazy"
                                                        />
                                                    )}
                                                    <div className="flex-1">
                                                        <h4 className="text-lg font-bold text-[#0D3B66]">
                                                            {product.nom}
                                                        </h4>
                                                        <p className="text-[#2F2F2F]/80">
                                                            ${product.prix} |
                                                            Type:{" "}
                                                            {product.type ||
                                                                "N/A"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setEditingProduct(
                                                                product
                                                            );
                                                            setNewProduct({
                                                                nom:
                                                                    product.nom ||
                                                                    "",
                                                                description:
                                                                    product.description ||
                                                                    "",
                                                                prix:
                                                                    product.prix ||
                                                                    "",
                                                                stock:
                                                                    product.stock ||
                                                                    "",
                                                                categoryId:
                                                                    product.categoryId ||
                                                                    "",
                                                                type:
                                                                    product.type ||
                                                                    "",
                                                                size:
                                                                    product.size ||
                                                                    "",
                                                                image: null,
                                                            });
                                                        }}
                                                        className="px-4 py-2 bg-[#F4A261] text-[#0D3B66] rounded-2xl hover:bg-[#E76F51] transition-all duration-300 font-semibold"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteProduct(
                                                                product.produitId
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all duration-300 font-semibold"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </>
                    )}

                    {/* Users Tab */}
                    {activeTab === "users" && (
                        <>
                            {/* Add/Edit User Section */}
                            <section className="bg-white rounded-3xl shadow-lg p-8 mb-8 transition-all duration-300 hover:shadow-xl">
                                <h3 className="text-2xl font-bold text-[#0D3B66] mb-6">
                                    {editingUser ? "Edit User" : "Add User"}
                                </h3>
                                <form
                                    onSubmit={
                                        editingUser
                                            ? handleUpdateUser
                                            : handleAddUser
                                    }
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <div>
                                        <label className="block text-sm font-semibold text-[#2F2F2F] mb-2">
                                            Username
                                        </label>
                                        <input
                                            type="text"
                                            value={newUser.username}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    username: e.target.value,
                                                })
                                            }
                                            required
                                            className="w-full p-3 rounded-2xl bg-[#FAF3DD] text-[#2F2F2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261] transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#2F2F2F] mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={newUser.email}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    email: e.target.value,
                                                })
                                            }
                                            required
                                            className="w-full p-3 rounded-2xl bg-[#FAF3DD] text-[#2F2F2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261] transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#2F2F2F] mb-2">
                                            Password{" "}
                                            {editingUser &&
                                                "(Leave blank to keep unchanged)"}
                                        </label>
                                        <input
                                            type="password"
                                            value={newUser.password}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    password: e.target.value,
                                                })
                                            }
                                            required={!editingUser}
                                            className="w-full p-3 rounded-2xl bg-[#FAF3DD] text-[#2F2F2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261] transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#2F2F2F] mb-2">
                                            Address
                                        </label>
                                        <input
                                            type="text"
                                            value={newUser.adresse}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    adresse: e.target.value,
                                                })
                                            }
                                            className="w-full p-3 rounded-2xl bg-[#FAF3DD] text-[#2F2F2F] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#F4A261] transition-all duration-300"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-[#2F2F2F] mb-2">
                                            Role
                                        </label>
                                        <select
                                            value={newUser.role}
                                            onChange={(e) =>
                                                setNewUser({
                                                    ...newUser,
                                                    role: e.target.value,
                                                })
                                            }
                                            className="w-full p-3 rounded-2xl bg-[#FAF3DD] text-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#F4A261] transition-all duration-300"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2 flex gap-4">
                                        <button
                                            type="submit"
                                            className="px-6 py-3 bg-[#F4A261] text-[#0D3B66] rounded-2xl hover:bg-[#E76F51] focus:ring-4 focus:ring-[#F4A261]/50 transition-all duration-300 font-semibold"
                                        >
                                            {editingUser
                                                ? "Update User"
                                                : "Add User"}
                                        </button>
                                        {editingUser && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setEditingUser(null);
                                                    setNewUser({
                                                        username: "",
                                                        email: "",
                                                        password: "",
                                                        adresse: "",
                                                        role: "user",
                                                    });
                                                }}
                                                className="px-6 py-3 bg-[#2F2F2F] text-white rounded-2xl hover:bg-[#4B4B4B] transition-all duration-300 font-semibold"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </section>

                            {/* Users List */}
                            <section className="bg-white rounded-3xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
                                <h3 className="text-2xl font-bold text-[#0D3B66] mb-6">
                                    Users
                                </h3>
                                {users.length === 0 ? (
                                    <p className="text-[#2F2F2F]/70">
                                        No users available.
                                    </p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {users.map((user) => (
                                            <div
                                                key={user.userId}
                                                className="p-4 bg-[#FAF3DD] rounded-2xl hover:bg-[#F4A261]/20 transition-all duration-300 transform hover:scale-[1.02] shadow-sm"
                                            >
                                                <div className="flex-1">
                                                    <h4 className="text-lg font-bold text-[#0D3B66]">
                                                        {user.username}
                                                    </h4>
                                                    <p className="text-[#2F2F2F]/80">
                                                        {user.email} | Role:{" "}
                                                        {user.role}
                                                    </p>
                                                    <p className="text-[#2F2F2F]/80">
                                                        Address:{" "}
                                                        {user.adresse || "N/A"}
                                                    </p>
                                                </div>
                                                <div className="mt-4 flex gap-3">
                                                    <button
                                                        onClick={() => {
                                                            setEditingUser(
                                                                user
                                                            );
                                                            setNewUser({
                                                                username:
                                                                    user.username ||
                                                                    "",
                                                                email:
                                                                    user.email ||
                                                                    "",
                                                                password: "",
                                                                adresse:
                                                                    user.adresse ||
                                                                    "",
                                                                role:
                                                                    user.role ||
                                                                    "user",
                                                            });
                                                        }}
                                                        className="px-4 py-2 bg-[#F4A261] text-[#0D3B66] rounded-2xl hover:bg-[#E76F51] transition-all duration-300 font-semibold"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            handleDeleteUser(
                                                                user.userId
                                                            )
                                                        }
                                                        className="px-4 py-2 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all duration-300 font-semibold"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>
                        </>
                    )}

                    {/* Orders Tab */}
                    {activeTab === "commandes" && (
                        <section className="bg-white rounded-3xl shadow-lg p-8 transition-all duration-300 hover:shadow-xl">
                            <h3 className="text-2xl font-bold text-[#0D3B66] mb-6">
                                Orders
                            </h3>
                            {commandesStatus === "loading" ? (
                                <div className="flex justify-center">
                                    <div className="w-8 h-8 border-4 border-[#F4A261] border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            ) : commandesError ? (
                                <div className="p-4 bg-red-100 text-red-800 rounded-2xl text-center">
                                    <p className="font-semibold text-[#2F2F2F]">
                                        {commandesError}
                                    </p>
                                </div>
                            ) : commandes.length === 0 ? (
                                <p className="text-[#2F2F2F]/70">
                                    No orders available.
                                </p>
                            ) : (
                                <div className="grid grid-cols-1 gap-6">
                                    {commandes.map((commande) => (
                                        <div
                                            key={commande.commandeId}
                                            className="p-6 bg-[#FAF3DD] rounded-2xl hover:bg-[#F4A261]/20 transition-all duration-300 transform hover:scale-[1.02] shadow-sm"
                                        >
                                            <div className="flex justify-between items-center mb-4">
                                                <div>
                                                    <h4 className="text-lg font-bold text-[#0D3B66]">
                                                        Order #
                                                        {commande.commandeId}
                                                    </h4>
                                                    <p className="text-[#2F2F2F]/80">
                                                        Total: $
                                                        {commande.totalPrix} |
                                                        Status:{" "}
                                                        {commande.stat
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                            commande.stat.slice(
                                                                1
                                                            )}
                                                    </p>
                                                    <p className="text-[#2F2F2F]/80">
                                                        Placed:{" "}
                                                        {new Date(
                                                            commande.created_at
                                                        ).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <select
                                                    value={commande.stat}
                                                    onChange={(e) =>
                                                        handleUpdateCommandeStatus(
                                                            commande.commandeId,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="p-2 rounded-2xl bg-[#FAF3DD] text-[#2F2F2F] focus:outline-none focus:ring-2 focus:ring-[#F4A261] transition-all duration-300"
                                                >
                                                    {[
                                                        "pending",
                                                        "processing",
                                                        "shipped",
                                                        "delivered",
                                                        "canceled",
                                                    ].map((status) => (
                                                        <option
                                                            key={status}
                                                            value={status}
                                                        >
                                                            {status
                                                                .charAt(0)
                                                                .toUpperCase() +
                                                                status.slice(1)}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="mt-4">
                                                <h5 className="text-sm font-semibold text-[#2F2F2F] mb-2">
                                                    Order Items
                                                </h5>
                                                {commande.order_items.length ===
                                                0 ? (
                                                    <p className="text-[#2F2F2F]/70 text-sm">
                                                        No items in this order.
                                                    </p>
                                                ) : (
                                                    <div className="border-t border-[#F4A261]/20 pt-2">
                                                        {commande.order_items.map(
                                                            (item) => (
                                                                <div
                                                                    key={
                                                                        item.produitId
                                                                    }
                                                                    className="flex justify-between text-[#2F2F2F]/80 text-sm py-1"
                                                                >
                                                                    <span>
                                                                        {item
                                                                            .product
                                                                            ?.nom ||
                                                                            "Unknown Product"}{" "}
                                                                        (x
                                                                        {
                                                                            item.quantite
                                                                        }
                                                                        )
                                                                    </span>
                                                                    <span>
                                                                        $
                                                                        {
                                                                            item.prix
                                                                        }
                                                                    </span>
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    )}
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;
