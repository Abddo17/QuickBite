import { foodImg1, foodImg2, foodImg3 } from "../constants";

const FoodSection = () => {
    const foodItems = [
        {
            title: "Fresh Bite Co.",
            description: "Fresh flavors, fast, always satisfying.",
            image: foodImg1,
        },
        {
            title: "Tasty Table Co.",
            description: "Fresh flavors for every craving.",
            image: foodImg2,
        },
        {
            title: "Flavor Feast Co.",
            description: "Savor bold flavors, crafted with care.",
            image: foodImg3,
        },
    ];

    return (
        <div className="bg-main-100 py-4 sm:py-8 md:py-12 poppins">
            <div className="container mx-auto px-4 sm:px-6 lg:px-34">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-5">
                    {foodItems.map((item, index) => (
                        <div
                            key={index}
                            className="bg-main-200 my-2 sm:my-4 rounded-3xl p-4 sm:p-6 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105"
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36 rounded-full mb-3 sm:mb-4 object-cover"
                            />
                            <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">
                                {item.title}
                            </h3>
                            <p className="text-xs sm:text-sm md:text-base">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FoodSection;
