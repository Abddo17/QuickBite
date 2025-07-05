import React, { useEffect, useRef } from "react";
import { heroImg, plateIcon } from "../constants";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/dist/ScrollTrigger";
import { Link, useNavigate } from "react-router-dom";
const HeroSection = () => {
    const navigate = useNavigate();
    const handleRedirect = () => {
        navigate("/store");
    };
    gsap.registerPlugin(useGSAP, ScrollTrigger);
    useGSAP(() => {
        gsap.fromTo(
            ".hero-text",
            { opacity: 0, x: -50 },
            {
                opacity: 1,
                x: 0,
                duration: 2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".hero-text",
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            }
        );

        gsap.fromTo(
            ".hero-image",
            { opacity: 0, x: 50 },
            {
                opacity: 1,
                x: 0,
                duration: 2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: ".hero-image",
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            }
        );
    }, []);
    return (
        <div>
            <section className="bg-main-100 flex items-center justify-center px-4 sm:px-6 lg:px-8 poppins ">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-around w-full">
                    <div className="hero-text w-full lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0 px-4">
                        <div className="inline-flex items-center mb-4 px-4 py-2 border-[#B4B4B4] border rounded-full shadow-sm">
                            <span className="text-sm font-medium text-gray-700 flex items-center">
                                <img
                                    src={plateIcon}
                                    width={20}
                                    height={20}
                                    className="mr-2"
                                />
                                Tasty Living
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight">
                            Deliciously Curated Foods for Every Diet and
                            Lifestyle
                        </h1>
                        <p className="mt-4 text-lg sm:text-lg text-gray-600 max-w-md lg:max-w-none mx-auto lg:mx-0">
                            Choose meals that suit your health needs, dietary
                            preferences, and allergy concerns making everyday
                            eating simple.
                        </p>
                        <button
                            className="mt-6 px-6 py-3 bg-yellow-500 text-gray-900 font-semibold rounded-full flex items-center justify-center mx-auto lg:mx-0 hover:bg-yellow-400 transition duration-300 cursor-pointer"
                            onClick={handleRedirect}
                        >
                            Order Now
                            <svg
                                className="ml-2 w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                ></path>
                            </svg>
                        </button>
                    </div>

                    <div className="hero-image w-full lg:w-1/2 flex justify-center items-center pl-0 lg:pl-10 px-4">
                        <img
                            src={heroImg}
                            alt="Burger"
                            className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl object-contain"
                        />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HeroSection;
