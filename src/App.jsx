import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "aos/dist/aos.css"; // Import AOS styles
import AOS from "aos";

// Components
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./components/HomePage";
import OrderHistory from "./components/OrderHistory";


// Lazy loaded components
const Signup = React.lazy(() => import("./components/Signup"));
const Login = React.lazy(() => import("./components/Login"));
const Category = React.lazy(() => import("./components/Category"));
const Products = React.lazy(() => import("./components/Products"));
const TopProducts = React.lazy(() => import("./components/TopProducts"));
const ProductDetails = React.lazy(() => import("./components/ProductDetails"));
const CartPage = React.lazy(() => import("./components/CartPage"));
const SearchResults = React.lazy(() => import("./components/SearchResults"));
const DummyTracking = React.lazy(() => import("./components/DummyTracking")); // lazy for consistency

// Wrapper component to use location for hiding navbar
const AppWrapper = () => {
  const location = useLocation();
  const [orderPopup, setOrderPopup] = React.useState(false);

  const handleOrderPopup = () => setOrderPopup((prev) => !prev);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      offset: 100,
      easing: "ease-in-out",
    });
  }, []);

  // Hide navbar on dummy tracking page
  const hideNavbar = location.pathname.startsWith("/dummy-tracking");

  return (
    <div
      className={`flex flex-col min-h-screen bg-white dark:bg-gray-900 dark:text-white duration-200 ${
        hideNavbar ? "justify-center items-center" : ""
      }`}
    >
      {!hideNavbar && <Navbar handleOrderPopup={handleOrderPopup} />}

      <div className={`flex-grow w-full ${hideNavbar ? "max-w-xl" : ""}`}>
        <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
          <Routes>
            <Route path="/" element={<HomePage handleOrderPopup={handleOrderPopup} />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/category/:categoryName" element={<Category />} />
            <Route path="/products" element={<Products />} />
            <Route path="/productdetails/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/dummy-tracking/:trackingNumber" element={<DummyTracking />} />
            <Route path="/orderhistory" element={<OrderHistory />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          

          </Routes>
        </Suspense>
      </div>

      {!hideNavbar && <ToastContainer position="top-right" autoClose={3000} hideProgressBar />}
    </div>
  );
};

const App = () => (
  <Router basename="/E-Commerce-Project">
    <AppWrapper />
  </Router>
);

export default App;
