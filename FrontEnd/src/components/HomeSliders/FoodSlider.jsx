import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { fetchProducts } from "../../features/productsSlice.jsx";
import { backendBaseUrl } from "../../API/axios.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import WireframeLoader from "../WireframeLoader.jsx";
import {
    selectProducts,
    selectProductsErrors,
    selectProductsStatus,
} from "../../selectors/ProductsSelectors.jsx";
import { topRightArrow } from "../../constants/index.js";

export default function FoodSlider() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const products = useSelector(selectProducts);
    const status = useSelector(selectProductsStatus);
    const error = useSelector(selectProductsErrors);

    const Foods = products?.map((product) => ({
        Id: product.produitId,
        Name: product.nom,
        Images: product.imageUrl,
        Poids: product.weight || "N/A",
        Price: `$${product.prix}`,
        Taille: product.size ? [product.size] : ["N/A"],
    }));

    if (status === "loading") return <WireframeLoader />;
    if (status === "failed")
        return <p className="text-center text-red-600">Error: {error}</p>;
    if (Foods?.length === 0)
        return <p className="text-center">No Items available.</p>;

    return (
        <section className="py-8 md:py-12 lg:py-16 bg-main-100 poppins">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-6 md:mb-8">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 md:mb-4">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600">
                            Slow Cooker Comfort Food
                        </span>
                    </h2>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"></p>
                </div>

                <div className="relative   xl:mx-40 lg:mx-10 md:mx-4 max-sm:mx-0">
                    <Swiper
                        slidesPerView={2}
                        spaceBetween={10}
                        navigation={{
                            nextEl: ".swiper-button-next",
                            prevEl: ".swiper-button-prev",
                        }}
                        pagination={{ clickable: true }}
                        modules={[Navigation, Pagination]}
                        breakpoints={{
                            320: { slidesPerView: 1, spaceBetween: 10 },
                            640: { slidesPerView: 2, spaceBetween: 15 },
                            1024: { slidesPerView: 2, spaceBetween: 20 },
                            1280: { slidesPerView: 2, spaceBetween: 20 },
                        }}
                        className="luxury-slider"
                    >
                        {Foods?.map((item) => (
                            <SwiperSlide key={item.Id}>
                                <Link to={`/product/${item.Id}`}>
                                    <div className="relative w-full h-[400px] mb-6 sm:h-[350px] md:h-[400px] lg:h-[450px]">
                                        <img
                                            src={backendBaseUrl + item.Images}
                                            alt={item.Name}
                                            className="w-full h-full object-fit rounded-4xl"
                                            loading="lazy"
                                        />
                                        <div className="absolute bottom-0 left-0 right-0 py-4 px-3 backdrop-blur-sm bg-gray-500/30 rounded-b-2xl">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <h3 className="text-lg sm:text-xl md:text-2xl font-light text-white">
                                                        {item.Name}
                                                    </h3>
                                                    <p className="text-base sm:text-lg md:text-xl text-white">
                                                        {item.Price}
                                                    </p>
                                                </div>
                                                <img
                                                    src={topRightArrow}
                                                    alt="Details"
                                                    width={50}
                                                    height={50}
                                                    onClick={() =>
                                                        navigate(
                                                            `/product/${item.Id}`
                                                        )
                                                    }
                                                    className="p-4 cursor-pointer bg-yellow-500 rounded-full hover:bg-main-300 transition"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button className="swiper-button-prev hidden  sm:block absolute left-0 top-1/2 transform -translate-y-1/2 z-10 text-red-600 p-3 rounded-full  transition"></button>
                    <button className="swiper-button-next hidden sm:block absolute right-0 top-1/2 transform -translate-y-1/2 z-10 text-red-600 p-3 rounded-full   transition"></button>
                </div>
            </div>
        </section>
    );
}
