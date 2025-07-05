import { ArrowUpRight } from "lucide-react";
import { promoImg, topRightArrow } from "../constants";
import { useNavigate } from "react-router-dom";

const StorePromo = () => {
    const navigate = useNavigate();
    const navigateTo = () => {
        navigate("/app");
    };
    return (
        <section className="bg-main-100 py-8 max-lg:my-3 px-4 sm:px-6 md:px-10 lg:px-20 poppins">
            <div className="bg-main-200 lg:h-72 my-4 rounded-[2rem] flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 md:p-6 lg:p-12 overflow-hidden relative mx-auto max-w-7xl">
                {/* Text Content */}
                <div className="w-full md:w-1/2 z-10 mb-6 md:mb-0">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-4">
                        Prefer to shop in store?
                    </h2>
                    <p className="text-gray-700 text-sm sm:text-base mb-6">
                        Use our Scan By Diet mobile app to find out—instantly
                        whether the food is right for you
                    </p>
                    <div className="flex gap-1">
                        <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-full transition cursor-pointer text-sm sm:text-base"
                            onClick={navigateTo}
                        >
                            Download The App
                        </button>
                        <img
                            src={topRightArrow}
                            onClick={navigateTo}
                            alt="Details"
                            width={50}
                            height={50}
                            className="p-4  cursor-pointer bg-yellow-500 rounded-full hover:bg-main-300 transition"
                        />
                    </div>
                </div>

                {/* Burger Image */}
                <div className="w-full md:w-1/2 relative">
                    <img
                        src={promoImg}
                        alt="Burger Promo"
                        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto object-contain z-20"
                    />
                </div>
            </div>
        </section>
    );
};

export default StorePromo;
