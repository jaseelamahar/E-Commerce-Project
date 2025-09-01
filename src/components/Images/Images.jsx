import React from "react";
import { useNavigate } from "react-router-dom";
import Image1 from "../../assets/men.jpeg";
import Image2 from "../../assets/sale.jpeg";
import Image3 from "../../assets/shopping.jpeg";
import Slider from "react-slick";

// Add `path` for navigation
const ImageList = [
  { id: 1, img: Image1, title: "Upto 50% OFF on all Men's Wear", path: "/category/Men's%20Wear" },
  { id: 2, img: Image3, title: "Enjoy upto 40% OFF across kidswear styles", path: "/category/Kids%20Wear" },
  { id: 3, img: Image2, title: "Rush before it's gone", path: "/category/Men's%20Wear" },
];

const Images = () => {
  const navigate = useNavigate();

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: false,
    pauseOnFocus: true,
  };

  return (
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gray-100 flex justify-center items-center dark:bg-gray-950 dark:text-white duration-200">
      <div className="h-[700px] w-[700px] bg-yellow-300/30 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z-[8]" />

      <div className="container pb-8 sm:pb-0">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* Text Content */}
                <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10 px-6">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold">
                    {data.title}
                  </h1>
                  <p className="text-sm">
                    Explore the best seasonal deals. Trendy styles, budget-friendly prices.
                  </p>
                  <div>
                    <button
                      onClick={() => navigate(data.path)}
                      className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:scale-105 duration-200 text-white py-2 px-4 rounded-full"
                    >
                      Order Now
                    </button>
                  </div>
                </div>

                {/* Image Section */}
                <div className="order-1 sm:order-2">
                  <div className="relative z-10">
                    <img
                      src={data.img}
                      alt={data.title}
                      className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-105 object-contain mx-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Images;
