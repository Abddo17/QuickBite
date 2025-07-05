import React, {useEffect, useState} from 'react';
import { gsap } from 'gsap';
import Lenis from 'lenis';
import {Link} from 'react-router-dom';
import {useSelector} from "react-redux";
import {selectProducts, selectProductsErrors, selectProductsStatus} from "../selectors/ProductsSelectors.jsx";
import {backendBaseUrl} from "../API/axios.js";
import Loader from "../components/Loader.jsx";


const OurBestProducts = () => {
    const [loading ,setLoading] = useState(true);
    const products = useSelector(selectProducts);
    const productsStatus = useSelector(selectProductsStatus);
    const productsErrors = useSelector(selectProductsErrors);



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

    // GSAP Animations
    useEffect(() => {
        // Animate images
        gsap.fromTo(
            '.animate-image',
            { opacity: 0, x: -100 },
            { opacity: 1, x: 0, duration: 1.5, ease: 'power3.out' }
        );

        // Animate text content
        gsap.fromTo(
            '.animate-text',
            { opacity: 0, y: 50 },
            { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out', delay: 0.3 }
        );

        // Animate button
        gsap.fromTo(
            '.animate-button',
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 1, ease: 'back.out(1.7)', delay: 0.6 }
        );
    }, []);


    //bikes
    const bikes = products.filter((product) => product.categoryId === 1);
    // clothes
    const clothes = products.filter((product) => product.categoryId === 3);
    // Helmets
    const helmets = products.filter((product) => product.categoryId === 2);
    useEffect(() => {
        if(bikes.length >0 && clothes.length > 0 && helmets.length >0 ){
            setLoading(false)
        }
    }, [bikes.length,clothes.length,helmets.length]);


    if (loading){
        return <Loader />
    }

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header Section */}
            <div className="py-16 text-center bg-gradient-to-b from-gray-900 to-black">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Our Best Products
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                    Discover our premium collection of bikes and gear
                </p>
            </div>

            {/* First Product - Agree Bike */}
            <section className="py-20 bg-gradient-to-b from-black to-gray-900">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 animate-image">
                        <Link to={`/product/${bikes[0].produitId}`}>
                        <div className="relative group overflow-hidden rounded-2xl" >
                            <div className="aspect-w-16 aspect-h-9">
                                <img
                                    src={`${backendBaseUrl}${bikes[0].imageUrl}` || ''}
                                    alt="Agree Pro"
                                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-white text-xl font-semibold">View Full Details</h3>
                            </div>
                        </div>
                        </Link>
                    </div>

                    <div className="md:w-1/2 mt-10 md:mt-0 md:pl-10 animate-text">
                        <span className="text-indigo-400 font-semibold">Premium Road Bike</span>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-2">
                            {bikes[0].nom}
                        </h1>
                        <p className="mt-4 text-lg text-gray-400">
                            {bikes[0].description}
                        </p>
                        <ul className="mt-6 space-y-2 text-gray-200">
                            <li className="flex items-center">
                                <span className="text-indigo-400 mr-2">✓</span>
                                Advanced carbon frame
                            </li>
                            <li className="flex items-center">
                                <span className="text-indigo-400 mr-2">✓</span>
                                Professional components
                            </li>
                            <li className="flex items-center">
                                <span className="text-indigo-400 mr-2">✓</span>
                                Aerodynamic design
                            </li>
                        </ul>
                        <div className="mt-8 flex items-center space-x-4">
                            <Link to={`/product/${bikes[0].produitId}`}>
                            <button className="px-6 py-3 bg-indigo-600 cursor-pointer hover:bg-indigo-700 rounded-full text-white font-semibold animate-button transition-colors">
                                View Details
                            </button>
                            </Link>
                            <span className="text-2xl font-bold text-indigo-400">${bikes[0].prix}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Second Product - Cycling Suit */}
            <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
                <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center">
                    <div className="md:w-1/2 mt-10 md:mt-0 md:pr-10 animate-text">
                        <span className="text-indigo-400 font-semibold">Professional Gear</span>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-2">
                            {clothes[0].nom}
                        </h1>
                        <p className="mt-4 text-lg text-gray-400">
                            {clothes[0].description}
                        </p>
                        <ul className="mt-6 space-y-2 text-gray-200">
                            <li className="flex items-center">
                                <span className="text-indigo-400 mr-2">✓</span>
                                Aerodynamic design
                            </li>
                            <li className="flex items-center">
                                <span className="text-indigo-400 mr-2">✓</span>
                                Moisture-wicking fabric
                            </li>
                            <li className="flex items-center">
                                <span className="text-indigo-400 mr-2">✓</span>
                                UV protection
                            </li>
                        </ul>
                        <div className="mt-8 flex items-center space-x-4">
                            <Link to={`/product/${clothes[0].produitId}`}>
                            <button className="px-6 py-3 bg-indigo-600 cursor-pointer hover:bg-indigo-700 rounded-full text-white font-semibold animate-button transition-colors">
                                View Details
                            </button>
                            </Link>
                            <span className="text-2xl font-bold text-indigo-400"> ${clothes[0].prix}</span>
                        </div>
                    </div>
                    <div className="md:w-1/2 animate-image">
                        <Link to={`/product/${clothes[0].produitId}`}>
                        <div className="relative group overflow-hidden rounded-2xl">
                            <div className="aspect-w-16 aspect-h-9">
                                <img
                                    src= {`${backendBaseUrl}${clothes[0].imageUrl}`}
                                    alt="Pro Cycling Suit"
                                    className="w-[500px] h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-white text-xl font-semibold">View Full Details</h3>
                            </div>
                        </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Third Product - MTB Helmet */}
            <section className="py-20 bg-gradient-to-b from-black to-gray-900">
                <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
                    <div className="md:w-1/2 animate-image">
                        <Link to={`/product/${helmets[0].produitId}`}>
                        <div className="relative group overflow-hidden rounded-2xl">
                            <div className="aspect-w-16 aspect-h-9">
                                <img
                                    src={`${backendBaseUrl}${helmets[0].imageUrl}`}
                                    alt="MTB Frisk Helmet"
                                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-white text-xl font-semibold">View Full Details</h3>
                            </div>
                        </div>
                        </Link>
                    </div>
                    <div className="md:w-1/2 mt-10 md:mt-0 md:pl-10 animate-text">
                        <span className="text-indigo-400 font-semibold">Mountain Biking Gear</span>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-2">
                            {helmets[0].nom}
                        </h1>
                        <p className="mt-4 text-lg text-gray-400">
                            {helmets[0].description}
                        </p>
                        <ul className="mt-6 space-y-2 text-gray-200">
                            <li className="flex items-center">
                                <span className="text-indigo-400 mr-2">✓</span>
                                Enhanced impact protection
                            </li>
                            <li className="flex items-center">
                                <span className="text-indigo-400 mr-2">✓</span>
                                Extended coverage
                            </li>
                            <li className="flex items-center">
                                <span className="text-indigo-400 mr-2">✓</span>
                                Adjustable visor
                            </li>
                        </ul>
                        <div className="mt-8 flex items-center space-x-4">
                            <Link to={`/product/${helmets[0].produitId}`}>
                            <button className="px-6 py-3 bg-indigo-600 cursor-pointer hover:bg-indigo-700 rounded-full text-white font-semibold animate-button transition-colors">
                                View Details
                            </button>
                            </Link>
                            <span className="text-2xl font-bold text-indigo-400">$  {helmets[0].prix}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Fourth Product - All Terrain Helmet */}
            <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
                <div className="container mx-auto px-6 flex flex-col-reverse md:flex-row items-center">
                    <div className="md:w-1/2 mt-10 md:mt-0 md:pr-10 animate-text">
                        <span className="text-indigo-400 font-semibold">Safety Gear</span>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight mt-2">
                            {helmets[1].nom}
                        </h1>
                        <p className="mt-4 text-lg text-gray-400">
                            {helmets[1].description}
                        </p>
                        <ul className="mt-6 space-y-2 text-gray-200">
                            <li className="flex items-center">
                                <span className="text-indigo-400 mr-2">✓</span>
                                Advanced impact protection
                            </li>
                            <li className="flex items-center">
                                <span className="text-indigo-400 mr-2">✓</span>
                                Ventilation system
                            </li>
                            <li className="flex items-center">
                                <span className="text-indigo-400 mr-2">✓</span>
                                Adjustable fit system
                            </li>
                        </ul>
                        <div className="mt-8 flex items-center space-x-4">
                            <Link to={`/product/${helmets[1].produitId}`}>
                            <button className="px-6 py-3 cursor-pointer bg-indigo-600 hover:bg-indigo-700 rounded-full text-white font-semibold animate-button transition-colors">
                                View Details
                            </button>
                            </Link>
                            <span className="text-2xl font-bold text-indigo-400">$  {helmets[1].prix}</span>
                        </div>
                    </div>
                    <div className="md:w-1/2 animate-image">
                        <Link to={`/product/${helmets[1].produitId}`}>
                        <div className="relative group overflow-hidden rounded-2xl">
                            <div className="aspect-w-16 aspect-h-9">
                                <img
                                    src=  {`${backendBaseUrl}${helmets[1].imageUrl}`}
                                    alt="All Terrain OX Grey Helmet"
                                    className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="text-white text-xl font-semibold">View Full Details</h3>
                            </div>
                        </div>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OurBestProducts;
