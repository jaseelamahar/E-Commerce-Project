import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Navbar from "./components/Navbar/Navbar";
import Images from "./components/Images/Images";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Category from "./components/Category";
import Products from "./components/Products";
import TopProducts from "./components/TopProducts";
import ProductDetails from "./components/ProductDetails";
import CartPage from "./components/CartPage";
import Banner from "./components/Banner";
import Footer from "./components/Footer";
import SearchResults from "./components/SearchResults";

// Banner images
import BannerImg1 from "./assets/trending kids.jpeg";
import BannerImg3 from "./assets/winter2.jpeg";

// React-slick slider
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const App = () => {
  const [orderPopup, setOrderPopup] = React.useState(false);

  const handleOrderPopup = () => {
    setOrderPopup(!orderPopup);
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 dark:text-white duration-200">
      <Navbar handleOrderPopup={handleOrderPopup} />

      <div className="flex-grow">
        <Routes>
          <Route path="/search" element={<SearchResults />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/category/:categoryName" element={<Category />} />
          <Route path="/products" element={<Products />} />
          <Route path="/productdetails/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Homepage */}
          <Route
            path="/"
            element={
              <>
                <Images />
                <Slider {...settings}>
                  <Banner image={BannerImg1} small />
                  <Banner image={BannerImg3} small />
                </Slider>
                <TopProducts handleOrderPopup={handleOrderPopup} />
                <Footer /> {/* Footer only on home */}
              </>
            }
          />
        </Routes>
      </div>

      {/* ✅ Single ToastContainer for entire app */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default App;
