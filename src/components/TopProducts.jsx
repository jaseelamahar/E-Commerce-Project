import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Img1 from "../assets/winter.jpeg";
import Img2 from "../assets/whiteset.jpeg";
import Img3 from "../assets/winter2.jpeg";
import { FaStar } from "react-icons/fa";

const ProductsData = [
  {
    id: 1,
    img: Img1,
    title: "Winter Collections",
    description:
      "Our Winter Collection blends cozy comfort with modern designs",
    path: "/category/hoodies",
    rating: 5, // ⭐⭐⭐⭐⭐
  },
  {
    id: 2,
    img: Img2,
    title: "Code sets",
    description: "Stylish code sets trendy",
    path: "/category/Kids%20Wear",
    rating: 3, // ⭐⭐⭐☆☆
  },
  {
    id: 3,
    img: Img3,
    title: "T-Shirt",
    description:
      "Experience ultimate comfort with our soft-touch t-shirts",
    path: "/category/Men's%20Wear",
    rating: 4, // ⭐⭐⭐⭐☆
  },
];

const TopProducts = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleOrderClick = (path) => {
    navigate(path);
  };

  return (
    <div className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p
            data-aos="fade-up"
            className="text-sm text-primary uppercase tracking-widest mb-2"
          >
            Top Rated Products for You
          </p>
          <h1
            data-aos="fade-up"
            className="text-3xl sm:text-5xl font-extrabold text-gray-900 dark:text-white mb-4"
          >
            Best Products
          </h1>
          <p
            data-aos="fade-up"
            className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
          >
            Explore our top-rated products handpicked for quality, style, and
            comfort.
          </p>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 place-items-center">
          {ProductsData.map((data) => (
            <div
              key={data.id}
              data-aos="zoom-in"
              className="group relative bg-gray-400 dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-xl transition duration-300 max-w-[300px] w-full flex flex-col"
            >
              {/* Image */}
              <div className="flex justify-center items-center p-6">
                <img
                  src={data.img}
                  alt={data.title}
                  className="max-h-[180px] object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-lg"
                />
              </div>

              {/* Product info */}
              <div className="p-6 text-center flex flex-col flex-grow">
                {/* Dynamic Rating */}
                <div className="flex justify-center gap-1 mb-3">
                  {Array(5)
                    .fill()
                    .map((_, i) => (
                      <FaStar
                        key={i}
                        className={`text-lg ${
                          i < data.rating ? "text-yellow-500" : "text-gray-300"
                        }`}
                      />
                    ))}
                </div>

                <h2 className="text-lg sm:text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                  {data.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm mb-5 line-clamp-3">
                  {data.description}
                </p>
                <button
                  onClick={() => handleOrderClick(data.path)}
                  className="bg-primary text-white hover:bg-amber-400 dark:hover:bg-amber-300 transition-colors duration-300 py-2 px-6 rounded-full font-medium mx-auto"
                >
                  Order Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopProducts;
