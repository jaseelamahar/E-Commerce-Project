import React, { useEffect } from "react";
import Slider from "react-slick";
import AOS from "aos";
import "aos/dist/aos.css";

import Images from "./Images/Images";
import Banner from "./Banner";
import TopProducts from "./TopProducts";
import Footer from "./Footer";
import GradientButton from "./GradientButton";

import BannerImg1 from "../assets/trending kids.jpeg";
import BannerImg3 from "../assets/winter2.jpeg";
import sliderSettings from "./sliderConfig";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-in-out",
      offset: 100,
    });
  }, []);
  const navigate=useNavigate();

  return (
    <main className="relative overflow-hidden bg-gradient-to-b from-pink-100 via-sky-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Images */}
      <Images />

      {/* Banner Slider */}
      <section data-aos="fade-up" data-aos-delay={50} className="mt-8">
        <Slider {...sliderSettings}>
          {[BannerImg1, BannerImg3].map((img, idx) => (
            <div key={idx} className="px-2 transition-transform transform hover:scale-105 duration-500">
              <Banner image={img} small>
                <div className="mt-6 flex justify-center sm:justify-start">
                  <GradientButton
                    text="Shop Now"
                    onClick={() => console.log(`Banner ${idx + 1} Clicked`)}
                  />
                </div>
              </Banner>
            </div>
          ))}
        </Slider>

        <style>
          {`
            .slick-dots li button:before {
              font-size: 12px;
              color: rgba(0,0,0,0.2);
            }
            .slick-dots li.slick-active button:before {
              color: transparent;
              background: linear-gradient(90deg, #f43f5e, #7c3aed, #4f46e5);
              border-radius: 50%;
              height: 12px;
              width: 12px;
              content: '';
            }
          `}
        </style>
      </section>

      {/* Top Products Section */}
      <section data-aos="fade-up" data-aos-delay={100}>
        <TopProducts />
      </section>

      {/* Call-to-Action Banner */}
      <section className="my-16 relative flex justify-center items-center bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl shadow-2xl p-8 mx-4 sm:mx-16">
        <div className="text-center sm:text-left text-white">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 drop-shadow-lg">
            Don’t Miss Out!
          </h2>
          <p className="text-lg sm:text-xl mb-6 drop-shadow-md">
            Exclusive summer offers are live now. Shop before it ends!
          </p>
              <GradientButton 
        text="Shop Now" 
        onClick={() => navigate("/home")} 
      />
</div>
      </section>

      {/* Footer Section */}
      <footer className="relative mt-16">
        <Footer />
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-pink-300 opacity-20 blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-indigo-300 opacity-15 blur-3xl pointer-events-none"></div>
        <div className="absolute top-10 right-1/2 w-40 h-40 rounded-full bg-purple-300 opacity-10 blur-2xl pointer-events-none"></div>
      </footer>
    </main>
  );
};

export default HomePage;
