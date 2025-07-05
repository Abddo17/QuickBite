import React, { useRef, useEffect } from "react";
import { gsap } from "gsap/gsap-core";

const Contact = () => {
    const handleSubmit = (e) => {
        e.preventDefault();
        alert("Thank you for your message! We'll get back to you soon.");
    };

    const buttonRef = useRef(null);
    useEffect(() => {
        const button = buttonRef.current;
        const onHover = () => {
            gsap.to(button, {
                scale: 1.05,
                backgroundColor: "var(--color-main-300)",
                color: "var(--color-zinc)",
                duration: 0.3,
                ease: "power2.out",
            });
        };

        const onLeave = () => {
            gsap.to(button, {
                scale: 1,
                backgroundColor: "var(--color-yellow-500)",
                color: "var(--color-main-zinc)",
                duration: 0.3,
                ease: "power2.out",
            });
        };

        button.addEventListener("mouseenter", onHover);
        button.addEventListener("mouseleave", onLeave);

        return () => {
            button.removeEventListener("mouseenter", onHover);
            button.removeEventListener("mouseleave", onLeave);
        };
    }, []);

    return (
        <div className="relative py-16 px-4 sm:px-6 lg:px-8 min-h-screen bg-main-100">
            <div className="relative z-10 max-w-7xl mx-auto ">
                <div className="text-center mb-12">
                    <h2
                        className="text-4xl md:text-5xl font-bold drop-shadow-lg"
                        style={{ color: "var(--color-gray-900)" }}
                    >
                        Contact QuickBite
                    </h2>
                    <p
                        className="text-lg md:text-xl mt-4 font-medium"
                        style={{ color: "var(--color-gray)" }}
                    >
                        Reach out for reservations, inquiries, or feedback
                    </p>
                </div>
                <div
                    className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/50 rounded-xl p-6 md:p-10 shadow-2xl"
                    style={{ borderColor: "var(--color-gray-300)" }}
                >
                    <div>
                        <h3
                            className="text-2xl font-semibold mb-8 pb-2 border-b"
                            style={{
                                color: "var(--color-gray-900)",
                                borderColor: "var(--color-gray-300)",
                            }}
                        >
                            Send Us a Message
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: "var(--color-gray)" }}
                                >
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    required
                                    className="mt-1 block w-full px-4 py-3 rounded-md text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-main-300)] focus:border-transparent"
                                    style={{
                                        backgroundColor:
                                            "var(--color-main-100)",
                                        borderColor: "var(--color-gray-300)",
                                    }}
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="email"
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: "var(--color-gray)" }}
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    required
                                    className="mt-1 block w-full px-4 py-3 rounded-md text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-main-300)] focus:border-transparent"
                                    style={{
                                        backgroundColor:
                                            "var(--color-main-100)",
                                        borderColor: "var(--color-gray-300)",
                                    }}
                                    placeholder="your.email@example.com"
                                />
                            </div>
                            <div>
                                <label
                                    htmlFor="message"
                                    className="block text-sm font-medium mb-2"
                                    style={{ color: "var(--color-gray)" }}
                                >
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    required
                                    className="mt-1 block w-full px-4 py-3 rounded-md text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[var(--color-main-300)] focus:border-transparent resize-none"
                                    style={{
                                        backgroundColor:
                                            "var(--color-main-100)",
                                        borderColor: "var(--color-gray-300)",
                                    }}
                                    placeholder="How can we assist you today?"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                ref={buttonRef}
                                className="mt-2 relative inline-flex items-center justify-center bg-yellow-500 px-8 py-3 font-medium rounded-md shadow-md transition-all duration-100 cursor-pointer"
                            >
                                <span className="relative flex items-center">
                                    Send Message
                                </span>
                            </button>
                        </form>
                    </div>
                    <div
                        className="p-6 rounded-xl"
                        style={{
                            backgroundColor: "var(--color-main-200)",
                            borderColor: "var(--color-gray-300)",
                        }}
                    >
                        <h3
                            className="text-2xl font-semibold mb-6 pb-2 border-b"
                            style={{
                                color: "var(--color-gray-900)",
                                borderColor: "var(--color-gray-300)",
                            }}
                        >
                            Visit Us
                        </h3>
                        <div
                            className="space-y-6"
                            style={{ color: "var(--color-gray)" }}
                        >
                            <div className="flex items-start space-x-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5 mt-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    style={{ color: "var(--color-yellow-500)" }}
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <div>
                                    <p
                                        className="font-bold"
                                        style={{
                                            color: "var(--color-gray-900)",
                                        }}
                                    >
                                        QuickBite Complete
                                    </p>
                                    <p>
                                        123 Rue
                                        <br />
                                        Fès, 30000
                                        <br />
                                        Morocco
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    style={{ color: "var(--color-yellow-500)" }}
                                >
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                <p>+212 612345678</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    style={{ color: "var(--color-yellow-500)" }}
                                >
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <p>QuickBite-Maroc@gmail.com</p>
                            </div>
                            <div
                                className="pt-4 mt-4 border-t"
                                style={{ borderColor: "var(--color-gray-300)" }}
                            >
                                <div className="flex space-x-4">
                                    <a
                                        href="#"
                                        className="hover:text-yellow-500 transition-colors"
                                        style={{ color: "var(--color-gray)" }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                                        </svg>
                                    </a>
                                    <a
                                        href="#"
                                        className="hover:text-yellow-500 transition-colors"
                                        style={{ color: "var(--color-gray)" }}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                            viewBox="0 0 16 16"
                                        >
                                            <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div className="mt-4">
                                <iframe
                                    title="QuickBite Complete Location"
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d105735.3046149996!2d-5.036347949999999!3d34.01812465!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd9f8b484ddf9e1f%3A0x8d2b6a1a3a5d5a1f!2sFes%2C%20Morocco!5e0!3m2!1sen!2sma!4v1699999999999!5m2!1sen!2sma"
                                    className="w-full h-48 rounded-lg shadow-lg"
                                    style={{
                                        borderColor: "var(--color-gray-300)",
                                        filter: "grayscale(50%) contrast(1.1) opacity(0.9)",
                                    }}
                                    allowFullScreen
                                    loading="lazy"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
