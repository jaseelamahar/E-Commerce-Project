
import React from "react";
import PropTypes from "prop-types";
import { GrSecure } from "react-icons/gr";
import { IoFastFood } from "react-icons/io5";
import { GiFoodTruck } from "react-icons/gi";

// Feature Item Component
const FeatureItem = ({ Icon, text, bg, delay }) => (
  <div
    data-aos="fade-up"
    data-aos-delay={delay}
    className="flex items-center gap-4 p-3 rounded-lg backdrop-blur-sm bg-white/30 dark:bg-gray-800/40 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
  >
    <Icon className={`h-12 w-12 p-3 rounded-full ${bg} text-white shadow-md`} />
    <p className="text-gray-900 dark:text-white font-semibold">{text}</p>
  </div>
);

FeatureItem.propTypes = {
  Icon: PropTypes.elementType.isRequired,
  text: PropTypes.string.isRequired,
  bg: PropTypes.string.isRequired,
  delay: PropTypes.number,
};

const Banner = ({ image, small = false }) => {
  return (
    <section
      className={`relative w-full overflow-hidden ${
        small ? "min-h-[220px]" : "min-h-[550px]"
      } flex items-center justify-center`}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 opacity-20 dark:opacity-15"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-8 items-center`}>
          {/* Image */}
          <div
            data-aos="zoom-in"
            data-aos-delay={100}
            className={`flex justify-center items-center w-full ${
              small ? "h-40 sm:h-48" : "h-[400px] sm:h-[450px]"
            }`}
          >
            <img
              src={image}
              alt="Banner"
              className="w-full h-full object-cover rounded-2xl shadow-2xl border border-white/20 dark:border-gray-700/40"
              loading="lazy"
              srcSet={`${image} 1x, ${image} 2x`}
            />
          </div>

          {/* Text Section */}
          <div className="flex flex-col justify-center gap-4 text-center sm:text-left">
            <h1
              data-aos="fade-up"
              data-aos-delay={200}
              className={`${
                small ? "text-2xl sm:text-3xl" : "text-4xl sm:text-5xl"
              } font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-500 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]`}
            >
              {/* Optional semi-opaque bg for extra readability */}
              <span className="bg-white/20 dark:bg-gray-800/30 px-2 py-1 rounded">
                Summer Sale up to 20% Off
              </span>
            </h1>
            <p
              data-aos="fade-up"
              data-aos-delay={300}
              className={`${
                small ? "text-sm sm:text-base" : "text-base sm:text-lg"
              } text-gray-900 dark:text-white drop-shadow-md`}
            >
              <span className="bg-white/20 dark:bg-gray-800/30 px-2 py-1 rounded">
                Playful styles, cool comfort, and big savings. Shop the kids’ summer collection today!
              </span>
            </p>

            {/* Features (small variant only) */}
            {small && (
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:gap-6">
                <FeatureItem Icon={GrSecure} text="Quality Products" bg="bg-violet-500" delay={400} />
                <FeatureItem Icon={IoFastFood} text="Fast Delivery" bg="bg-orange-500" delay={500} />
                <FeatureItem Icon={GiFoodTruck} text="Easy Payment Method" bg="bg-green-500" delay={600} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Background Decorative Shapes */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-pink-300 opacity-20 blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-indigo-300 opacity-15 blur-3xl pointer-events-none"></div>
      <div className="absolute top-10 right-1/2 w-40 h-40 rounded-full bg-yellow-300 opacity-10 blur-2xl pointer-events-none"></div>
    </section>
  );
};

Banner.propTypes = {
  image: PropTypes.string.isRequired,
  small: PropTypes.bool,
};

export default Banner;
