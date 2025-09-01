
import React from "react";
import { GrSecure } from "react-icons/gr";
import { IoFastFood } from "react-icons/io5";
import { GiFoodTruck } from "react-icons/gi";

const Banner = ({ image, small }) => {
  return (
    <div
      className={`flex justify-center items-center ${
        small ? "min-h-[200px]" : "min-h-[550px]"
      }`}
    >
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          {/* Image Section */}
          <div data-aos="zoom-in" className="flex justify-center">
            <img
              src={image}
              alt="Banner"
              className={`${
                small ? "h-40 object-cover" : "h-[400px] object-contain"
              } drop-shadow-lg`}
            />
          </div>

          {/* Text Section */}
          <div className="flex flex-col justify-center gap-4 text-center sm:text-left">
            <h1
              data-aos="fade-up"
              className={`font-bold ${
                small ? "text-xl sm:text-2xl" : "text-3xl sm:text-4xl"
              } text-black drop-shadow-lg`}
            >
              Summer Sale upto 20% Off
            </h1>
            <p
              data-aos="fade-up"
              className={`${
                small ? "text-xs sm:text-sm" : "text-sm sm:text-base"
              } text-black drop-shadow-md tracking-wide leading-5`}
            >
              Playful styles, cool comfort, and big savings. Shop the kids’ summer collection today!
            </p>

            {/* Icons only for large banners */}
            {small && (
              <div className="flex flex-col gap-4 mt-4">
                <div data-aos="fade-up" className="flex items-center gap-4">
                  <GrSecure className="text-2xl h-12 w-12 shadow-sm p-4 rounded-full bg-violet-100" />
                  <p className="text-gray-800 font-medium">Quality Products</p>
                </div>
                <div data-aos="fade-up" className="flex items-center gap-4">
                  <IoFastFood className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-orange-100" />
                  <p className="text-gray-800 font-medium">Fast Delivery</p>
                </div>
                <div data-aos="fade-up" className="flex items-center gap-4">
                  <GiFoodTruck className="text-4xl h-12 w-12 shadow-sm p-4 rounded-full bg-green-100" />
                  <p className="text-gray-800 font-medium">Easy Payment method</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
