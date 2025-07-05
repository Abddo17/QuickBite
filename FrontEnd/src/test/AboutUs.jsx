import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";
import { FaUtensils, FaCoffee, FaStar, FaHeart } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

const AboutUs = () => {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => lenis.destroy();
    }, []);

    useEffect(() => {
        const sections = document.querySelectorAll(".animate-section");

        sections.forEach((section, index) => {
            gsap.fromTo(
                section,
                { opacity: 0, y: 30 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    delay: index * 0.1,
                    scrollTrigger: {
                        trigger: section,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                }
            );
        });
    }, []);

    return (
        <div
            className="min-h-screen text-gray-900 poppins"
            style={{
                backgroundColor: "var(--color-main-100)",
            }}
        >
            <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url(https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80)",
                    }}
                ></div>
                <div
                    className="absolute inset-0"
                    style={{
                        background:
                            "linear-gradient(to bottom, rgba(245, 236, 222, 0.2), rgba(245, 236, 222, 0.2))",
                    }}
                ></div>
                <div className="relative z-10 text-center px-6 animate-section">
                    <h1
                        className="text-5xl md:text-7xl font-extrabold mb-6"
                        style={{ color: "var(--color-main-100)" }}
                    >
                        About QuickBite
                    </h1>
                    <p
                        className="text-xl md:text-2xl max-w-3xl mx-auto font-medium"
                        style={{ color: "var(--color-gray)" }}
                    >
                        Savoring Moroccan traditions since 2015
                    </p>
                </div>
            </section>

            <section
                className="py-24"
                style={{ backgroundColor: "var(--color-main-100)" }}
            >
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center animate-section">
                        <div className="order-2 lg:order-1">
                            <h2
                                className="text-4xl md:text-5xl font-bold mb-6"
                                style={{ color: "var(--color-gray-900)" }}
                            >
                                Our Story
                            </h2>
                            <p
                                className="text-xl mb-6"
                                style={{ color: "var(--color-gray)" }}
                            >
                                Established in 2015 in Fès, QuickBite Complete
                                began as a family-run kitchen, dedicated to
                                sharing the soul of Moroccan cuisine. From
                                aromatic tagines to delicate pastries, our
                                dishes are crafted with love and tradition.
                            </p>
                            <p
                                className="text-xl mb-6"
                                style={{ color: "var(--color-gray)" }}
                            >
                                Now a leading e-commerce restaurant, we bring
                                the flavors of Morocco to homes worldwide,
                                blending heritage with modern convenience, all
                                while upholding our commitment to quality and
                                authenticity.
                            </p>
                        </div>
                        <div className="order-1 lg:order-2 relative">
                            <div className="aspect-w-16 aspect-h-9 rounded-2xl overflow-hidden shadow-xl">
                                <img
                                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                                    alt="Our Story"
                                    className="w-full h-full object-cover"
                                    style={{ filter: "contrast(1.1)" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="py-24"
                style={{ backgroundColor: "var(--color-main-200)" }}
            >
                <div className="container mx-auto px-6 max-w-6xl">
                    <h2
                        className="text-4xl md:text-5xl font-bold text-center mb-12"
                        style={{ color: "var(--color-gray-900)" }}
                    >
                        Our Mission & Values
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div
                            className="text-center p-8 rounded-2xl shadow-lg transition-transform hover:-translate-y-2 animate-section"
                            style={{ backgroundColor: "var(--color-main-100)" }}
                        >
                            <FaUtensils
                                className="w-10 h-10 mx-auto mb-4"
                                style={{ color: "var(--color-main-300)" }}
                            />
                            <h3
                                className="text-xl font-semibold mb-2"
                                style={{ color: "var(--color-gray-900)" }}
                            >
                                Authenticity
                            </h3>
                            <p style={{ color: "var(--color-gray)" }}>
                                Honoring Morocco’s culinary heritage
                            </p>
                        </div>
                        <div
                            className="text-center p-8 rounded-2xl shadow-lg transition-transform hover:-translate-y-2 animate-section"
                            style={{ backgroundColor: "var(--color-main-100)" }}
                        >
                            <FaCoffee
                                className="w-10 h-10 mx-auto mb-4"
                                style={{ color: "var(--color-main-300)" }}
                            />
                            <h3
                                className="text-xl font-semibold mb-2"
                                style={{ color: "var(--color-gray-900)" }}
                            >
                                Hospitality
                            </h3>
                            <p style={{ color: "var(--color-gray)" }}>
                                Treating every guest like family
                            </p>
                        </div>
                        <div
                            className="text-center p-8 rounded-2xl shadow-lg transition-transform hover:-translate-y-2 animate-section"
                            style={{ backgroundColor: "var(--color-main-100)" }}
                        >
                            <FaStar
                                className="w-10 h-10 mx-auto mb-4"
                                style={{ color: "var(--color-main-300)" }}
                            />
                            <h3
                                className="text-xl font-semibold mb-2"
                                style={{ color: "var(--color-gray-900)" }}
                            >
                                Quality
                            </h3>
                            <p style={{ color: "var(--color-gray)" }}>
                                Using only the freshest ingredients
                            </p>
                        </div>
                        <div
                            className="text-center p-8 rounded-2xl shadow-lg transition-transform hover:-translate-y-2 animate-section"
                            style={{ backgroundColor: "var(--color-main-100)" }}
                        >
                            <FaHeart
                                className="w-10 h-10 mx-auto mb-4"
                                style={{ color: "var(--color-main-300)" }}
                            />
                            <h3
                                className="text-xl font-semibold mb-2"
                                style={{ color: "var(--color-gray-900)" }}
                            >
                                Passion
                            </h3>
                            <p style={{ color: "var(--color-gray)" }}>
                                Cooking with heart and soul
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="py-24"
                style={{ backgroundColor: "var(--color-main-100)" }}
            >
                <div className="container mx-auto px-6 max-w-6xl">
                    <h2
                        className="text-4xl md:text-5xl font-bold text-center mb-12"
                        style={{ color: "var(--color-gray-900)" }}
                    >
                        Our Achievements
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        <div
                            className="text-center p-8 rounded-2xl shadow-lg transition-transform hover:-translate-y-2 animate-section"
                            style={{ backgroundColor: "var(--color-main-200)" }}
                        >
                            <div
                                className="text-4xl font-bold mb-2"
                                style={{ color: "var(--color-main-300)" }}
                            >
                                8+
                            </div>
                            <p style={{ color: "var(--color-gray)" }}>
                                Years of Culinary Excellence
                            </p>
                        </div>
                        <div
                            className="text-center p-8 rounded-2xl shadow-lg transition-transform hover:-translate-y-2 animate-section"
                            style={{ backgroundColor: "var(--color-main-200)" }}
                        >
                            <div
                                className="text-4xl font-bold mb-2"
                                style={{ color: "var(--color-main-300)" }}
                            >
                                20K+
                            </div>
                            <p style={{ color: "var(--color-gray)" }}>
                                Satisfied Diners
                            </p>
                        </div>
                        <div
                            className="text-center p-8 rounded-2xl shadow-lg transition-transform hover:-translate-y-2 animate-section"
                            style={{ backgroundColor: "var(--color-main-200)" }}
                        >
                            <div
                                className="text-4xl font-bold mb-2"
                                style={{ color: "var(--color-main-300)" }}
                            >
                                50+
                            </div>
                            <p style={{ color: "var(--color-gray)" }}>
                                Unique Dishes
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section
                className="py-24"
                style={{ backgroundColor: "var(--color-main-200)" }}
            >
                <div className="container mx-auto px-6 text-center max-w-3xl">
                    <h2
                        className="text-4xl md:text-5xl font-bold mb-6"
                        style={{ color: "var(--color-gray-900)" }}
                    >
                        Taste the Journey
                    </h2>
                    <p
                        className="text-lg mb-8"
                        style={{ color: "var(--color-gray)" }}
                    >
                        Discover the vibrant flavors of Morocco with QuickBite
                        Complete, delivered straight to your door.
                    </p>
                    <a
                        href="/store    "
                        className="inline-block px-8 py-4 rounded-full font-semibold transition-all duration-300 hover:-translate-y-1"
                        style={{
                            backgroundColor: "var(--color-yellow-500)",
                        }}
                    >
                        Order Now
                    </a>
                </div>
            </section>
        </div>
    );
};

export default AboutUs;
