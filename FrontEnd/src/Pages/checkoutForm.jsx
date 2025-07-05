import React, { useEffect, useState, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { fetchCart, clearCart, resetCartError } from "../features/cartSlice";
import { axiosInstance, backendBaseUrl } from "../API/axios.js";
import { FaLock, FaShoppingCart } from "react-icons/fa";
import { gsap } from "gsap";
import { selectIsAuthenticated } from "../selectors/authSelectors.jsx";

const stripePromise = loadStripe(
    "pk_test_51RPTnXRUOQUMbCp6dhm33mVkuVdr5RfZWIBGqu8b64LHxmcCz2vWKcWWaJmhraNSkF35XAXgWQssflijVbNZprBF001LzcCJJt"
);

const CheckoutForm = ({ cartItems, total, onSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [clientSecret, setClientSecret] = useState("");
    const [fetchStatus, setFetchStatus] = useState("idle");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchClientSecret = useCallback(async () => {
        console.log("fetchClientSecret called with amount:", total * 100);
        setFetchStatus("loading");
        try {
            const response = await axiosInstance.post("api/stripe/pay", {
                amount: Math.round(total * 100),
            });
            console.log("ClientSecret response:", response.data);
            setClientSecret(response.data.clientSecret);
            setFetchStatus("succeeded");
        } catch (err) {
            const errorMsg =
                err.response?.data?.error ||
                "Failed to initialize payment. Please try again.";
            setError(errorMsg);
            setFetchStatus("failed");
            console.error(
                "Stripe API error:",
                err,
                "Response:",
                err.response?.data
            );
        }
    }, [total]);

    useEffect(() => {
        let isMounted = true;
        console.log(
            "useEffect running, fetchStatus:",
            fetchStatus,
            "total:",
            total
        );

        if (total > 0 && fetchStatus === "idle" && isMounted) {
            fetchClientSecret();
        }

        return () => {
            isMounted = false;
            console.log("useEffect cleanup");
        };
    }, [total, fetchStatus, fetchClientSecret]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!stripe || !elements || !clientSecret) {
            setError("Payment system not ready. Please try again.");
            return;
        }

        setProcessing(true);
        const cardElement = elements.getElement(CardElement);

        try {
            const { error: stripeError, paymentIntent } =
                await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: { name: "Customer Name" },
                    },
                });

            if (stripeError) {
                setError(stripeError.message);
                setProcessing(false);
                return;
            }

            if (paymentIntent.status === "succeeded") {
                try {
                    const response = await axiosInstance.post("api/commandes");
                    dispatch(clearCart());
                    onSuccess(response.data);
                    navigate("/order-confirmation", {
                        state: { order: response.data },
                    });
                } catch (err) {
                    setError("Order creation failed. Please contact support.");
                    setProcessing(false);
                }
            }
        } catch (err) {
            setError("Payment processing failed. Please try again.");
            setProcessing(false);
        }
    };

    if (fetchStatus === "loading") {
        return (
            <div className="flex justify-center items-center py-8">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-4 border-gray-300 border-t-main-300" />
            </div>
        );
    }

    if (fetchStatus === "failed") {
        return (
            <div className="rounded-2xl bg-main-200 p-8 text-center shadow-lg">
                <p className="text-lg text-gray-900 mb-4">{error}</p>
                <button
                    onClick={() => {
                        setFetchStatus("idle");
                        setError(null);
                    }}
                    className="inline-block rounded-full bg-primary-800 px-6 py-3 text-sm font-medium text-main-100 transition-all hover:bg-main-300 hover:text-zinc"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray mb-2">
                    Card Details
                </label>
                <div className="rounded-lg bg-main-100 p-4 border border-gray-300">
                    <CardElement
                        className="stripe-card-element"
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: "#111827",
                                    "::placeholder": { color: "#86868b" },
                                },
                                invalid: { color: "#9b1c1c" },
                            },
                        }}
                    />
                </div>
            </div>
            {error && (
                <p className="text-sm text-center text-gray-900">{error}</p>
            )}
            <button
                type="submit"
                disabled={!stripe || !clientSecret || processing}
                className="w-full rounded-full bg-primary-800 px-5 py-3 text-sm font-medium text-main-100 transition-all hover:bg-main-300 hover:text-zinc disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
                {processing ? "Processing..." : "Pay Now"}
            </button>
        </form>
    );
};

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isLoggedIn = useSelector(selectIsAuthenticated);
    const {
        items: cartItems,
        status,
        error,
    } = useSelector((state) => state.cart);

    const savings = 5;
    const pickup = 0;
    const tax = 2.77;
    const subtotal = cartItems.reduce(
        (sum, item) => sum + item.product.prix * item.quantite,
        0
    );
    const total = subtotal - savings + pickup + tax;

    useEffect(() => {
        if (status === "idle" && isLoggedIn) {
            dispatch(fetchCart());
        }
    }, [status, dispatch, isLoggedIn]);

    useEffect(() => {
        if (status === "succeeded" && cartItems.length > 0) {
            gsap.fromTo(
                ".checkout-section",
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
            );
            gsap.fromTo(
                ".order-summary",
                { opacity: 0, x: 20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    delay: 0.3,
                }
            );
        }
    }, [status, cartItems]);

    const handleOrderSuccess = (order) => {
        console.log("Order created:", order);
    };

    if (!isLoggedIn) {
        return (
            <section className="min-h-screen bg-main-100 py-16 poppins">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl bg-main-200 p-8 text-center shadow-lg">
                        <FaShoppingCart className="mx-auto h-16 w-16 text-gray mb-4" />
                        <p className="text-lg text-gray mb-4">
                            Please log in to proceed to checkout.
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

    if (cartItems.length === 0) {
        return (
            <section className="min-h-screen bg-main-100 py-16 poppins">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="rounded-2xl bg-main-200 p-8 text-center shadow-lg">
                        <FaShoppingCart className="mx-auto h-16 w-16 text-gray mb-4" />
                        <p className="text-lg text-gray mb-4">
                            Your cart is empty.
                        </p>
                        <Link
                            to="/Store"
                            className="inline-block rounded-full bg-primary-800 px-6 py-3 text-sm font-medium text-main-100 transition-all hover:bg-main-300 hover:text-zinc"
                        >
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="min-h-screen bg-main-100 py-16 poppins">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-8">
                    Checkout
                </h2>
                <div className="lg:flex lg:gap-8">
                    <div className="checkout-section flex-1">
                        <div className="rounded-2xl bg-main-200 p-6 shadow-lg mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                Payment Details
                            </h3>
                            <Elements stripe={stripePromise}>
                                <CheckoutForm
                                    cartItems={cartItems}
                                    total={total}
                                    onSuccess={handleOrderSuccess}
                                />
                            </Elements>
                        </div>
                        <div className="rounded-2xl bg-main-200 p-6 shadow-lg">
                            <h3 className="text-xl font-bold text-gray-900 mb-6">
                                Cart Items
                            </h3>
                            <div className="space-y-6">
                                {cartItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4"
                                    >
                                        <img
                                            className="h-24 w-24 object-contain rounded-lg"
                                            src={`${backendBaseUrl}/storage/${item.product.imageUrl}`}
                                            alt={item.product.nom}
                                        />
                                        <div className="flex-1">
                                            <p className="text-lg font-semibold text-gray-900">
                                                {item.product.nom}
                                            </p>
                                            <p className="text-sm text-gray">
                                                Quantity: {item.quantite}
                                            </p>
                                            <p className="text-sm font-bold text-main-300">
                                                $
                                                {(
                                                    item.product.prix *
                                                    item.quantite
                                                ).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="order-summary mt-8 w-full max-w-md lg:mt-0">
                        <div className="sticky top-6 rounded-2xl bg-main-200 shadow-lg">
                            <div className="bg-main-100 p-6">
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
                            </div>
                        </div>
                        <div className="mt-6 rounded-2xl bg-main-100 p-6 shadow-lg">
                            <div className="flex items-start gap-3">
                                <div className="rounded-full bg-main-300 p-2 text-zinc">
                                    <FaLock className="h-5 w-5" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">
                                        Secure Checkout
                                    </h4>
                                    <p className="mt-1 text-xs text-gray">
                                        Your payment information is protected
                                        with industry-standard encryption
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Checkout;
