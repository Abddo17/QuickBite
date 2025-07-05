import React from "react";
import { useLocation, Link } from "react-router-dom";
import { FaShoppingCart } from "react-icons/fa";

const OrderConfirmation = () => {
    const { state } = useLocation();
    const order = state?.order;

    if (!order) {
        return (
            <div className="min-h-screen bg-main-100 py-16 flex justify-center items-center">
                <p className="text-lg text-gray-900">No order found.</p>
            </div>
        );
    }

    return (
        <section className="min-h-screen bg-main-100 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 mb-8">
                    Order Confirmed
                </h2>
                <div className="rounded-2xl bg-main-200 p-6 shadow-lg">
                    <p className="text-lg font-semibold text-gray-900 mb-4">
                        Thank you for your order!
                    </p>
                    <p className="text-sm text-gray mb-4">
                        Order ID: {order.commandeId}
                    </p>
                    <div className="space-y-4">
                        {order.orderItems?.map((item) => (
                            <div
                                key={item.produitId}
                                className="flex justify-between"
                            >
                                <p className="text-sm text-gray-900">
                                    {item.product.nom} x {item.quantite}
                                </p>
                                <p className="text-sm text-main-300">
                                    $
                                    {(
                                        item.prix * item.quantite
                                    ).toLocaleString()}
                                </p>
                            </div>
                        ))}
                    </div>
                    <p className="text-lg font-bold text-gray-900 mt-4">
                        Total: ${order.totalPrix.toLocaleString()}
                    </p>
                    <Link
                        to="/Store"
                        className="mt-6 inline-block rounded-full bg-main-300 px-6 py-3 text-sm font-medium  transition-all hover:bg-yellow-500 hover:text-zinc"
                    >
                        <FaShoppingCart className="mr-2 inline h-4 w-4" />
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default OrderConfirmation;
