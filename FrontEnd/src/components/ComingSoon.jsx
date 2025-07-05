import { useNavigate } from "react-router-dom";
import { promoImg, topRightArrow } from "../constants";

const ComingSoon = () => {
    const navigate = useNavigate();
    const navigateTo = () => {
        navigate("/");
    };
    return (
        <section className="bg-main-100 min-h-screen flex items-center justify-center py-8 px-4 sm:px-6 md:px-10 lg:px-20 poppins">
            <div className="bg-main-200 rounded-[2rem] flex flex-col md:flex-row items-center justify-between p-6 sm:p-8 md:p-10 lg:p-12 overflow-hidden relative mx-auto max-w-7xl">
                {/* Text Content */}
                <div className="w-full md:w-1/2 z-10 mb-6 md:mb-0 text-center md:text-left">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4">
                        Our App is Under Construction!
                    </h1>
                    <p className="text-gray-700 text-sm sm:text-base mb-6">
                        We're hard at work building the Scan By Diet app. Soon,
                        you'll be able to instantly check if foods match your
                        dietary needs, right from your phone.
                    </p>
                    <div className="flex justify-center md:justify-start gap-1">
                        <button
                            className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-medium py-2 px-4 sm:py-3 sm:px-6 rounded-full transition cursor-pointer text-sm sm:text-base"
                            onClick={navigateTo}
                        >
                            Go Back
                        </button>
                        <img
                            src={topRightArrow}
                            alt="Details"
                            width={50}
                            height={50}
                            className="p-4  cursor-pointer bg-yellow-500 rounded-full hover:bg-main-300 transition"
                            onClick={navigateTo}
                        />
                    </div>
                </div>

                {/* Promo Image */}
                <div className="w-full md:w-1/2 relative">
                    <img
                        src={promoImg}
                        alt="App Promo"
                        className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mx-auto object-contain z-20"
                    />
                </div>
            </div>
        </section>
    );
};

export default ComingSoon;
