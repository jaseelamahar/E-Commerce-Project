import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import GradientButton from "./GradientButton";

import Img1 from "../assets/winter.jpeg";
import Img2 from "../assets/whiteset.jpeg";
import Img3 from "../assets/tshirt.jpeg";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Winter Collections",
    description: "Our Winter Collection blends cozy comfort with modern designs",
    path: "/category/Hoodies",
    rating: 5,
  },
  {
    id: 2,
    img: Img2,
    title: "Code Sets",
    description: "Stylish code sets trendy",
    path: "/category/Kids%20Wear",
    rating: 3,
  },
  {
    id: 3,
    img: Img3,
    title: "T-Shirt",
    description: "Experience ultimate comfort with our soft-touch t-shirts",
    path: "/category/Men's%20Wear",
    rating: 4,
  },
];

const TopProducts = () => {
  const navigate = useNavigate();

  const handleOrderClick = (path) => {
    navigate(path);
  };

  return (
    <div className="py-16">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p data-aos="fade-up" className="text-sm text-pink-500 uppercase tracking-widest mb-2">
            Top Rated Products for You
          </p>
          <h1 data-aos="fade-up" className="text-3xl sm:text-5xl font-extrabold text-blue-900 dark:text-white mb-4">
            Best Products
          </h1>
          <p data-aos="fade-up" className="text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Explore our top-rated products handpicked for quality, style, and comfort.
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 place-items-center">
          {ProductsData.map((data) => (
            <div
              key={data.id}
              data-aos="zoom-in"
              className="group relative bg-gradient-to-br from-pink-50 via-sky-50 to-blue-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-900 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 max-w-[300px] w-full flex flex-col overflow-hidden"
            >
              {/* Image */}
              <div className="flex justify-center items-center p-6 h-48">
                <img
                  src={data.img}
                  alt={data.title}
                  className="w-full h-full object-cover rounded-2xl drop-shadow-lg transition-transform transform group-hover:scale-105"
                  loading="lazy"
                  srcSet={`${data.img} 1x, ${data.img} 2x`}
                />
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col flex-grow text-center">
                {/* Rating */}
                <div className="flex justify-center gap-1 mb-3">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-lg ${i < data.rating ? "text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                </div>

                <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {data.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-5 line-clamp-3">
                  {data.description}
                </p>

                {/* Gradient Button */}
                <div className="mx-auto">
                  <GradientButton
                    text="Order Now"
                    onClick={() => handleOrderClick(data.path)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
