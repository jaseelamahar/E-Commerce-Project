import { useNavigate } from "react-router-dom";
import Image1 from "../../assets/men.jpeg";
import Image2 from "../../assets/sale.jpeg";
import Image3 from "../../assets/shopping.jpeg";
import Slider from "react-slick";
import GradientButton from "../GradientButton"; // use same gradient button

const ImageList = [
  { id: 1, img: Image1, title: "Upto 50% OFF on all Men's Wear", path: "/category/Men's%20Wear" },
  { id: 2, img: Image3, title: "Enjoy upto 40% OFF across kidswear styles", path: "/category/Kids%20Wear" },
  { id: 3, img: Image2, title: "Rush before it's gone", path: "/category/Men's%20Wear" },
];

const Images = () => {
  const navigate = useNavigate();

  const settings = {
    dots: true,
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
    <div className="relative overflow-hidden min-h-[550px] sm:min-h-[650px] bg-gradient-to-b from-pink-100 via-sky-100 to-blue-100 dark:from-gray-950 dark:via-gray-900 flex justify-center items-center duration-200">
      <div className="h-[700px] w-[700px] bg-pink-300/20 absolute -top-1/2 right-0 rounded-3xl rotate-45 -z-[8]" />

      <div className="container pb-8 sm:pb-0">
        <Slider {...settings}>
          {ImageList.map((data) => (
            <div key={data.id}>
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {/* Text Content */}
                <div className="flex flex-col justify-center gap-4 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10 px-6">
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                    {data.title}
                  </h1>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Explore the best seasonal deals. Trendy styles, budget-friendly prices.
                  </p>
                  <div className="mt-4">
                    <GradientButton
                      text="Order Now"
                      onClick={() => navigate(data.path)}
                    />
                  </div>
                </div>

                {/* Image Section */}
                <div className="order-1 sm:order-2">
                  <div className="relative z-10">
                    <img
                      src={data.img}
                      alt={data.title}
                      className="w-[300px] h-[300px] sm:h-[450px] sm:w-[450px] sm:scale-105 object-contain mx-auto select-none outline-none"
                      loading="lazy"
                      srcSet={`${data.img} 1x, ${data.img} 2x`}
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
