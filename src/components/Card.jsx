import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { auth } from "../firebase";
import { addToCart } from "./AddToCart";
import { toast } from "react-toastify";

const Card = ({ product }) => {
  const navigate = useNavigate();

  const ratings = product.ratings || [];
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : product.rating || 3.5;

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-gray-300" />);
    }
    return stars;
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!auth.currentUser) {
      toast.error("Please login to use the cart");
      return;
    }
    addToCart(product);
    toast.success(`${product.name || "Product"} added to cart!`);
  };

  return (
    <div
      className="rounded-3xl bg-gray-50 shadow-sm hover:shadow-lg transition-transform duration-300 transform hover:-translate-y-2 hover:scale-105 p-5 flex flex-col cursor-pointer group"
      onClick={() => navigate(`/productdetails/${product.id}`, { state: { product } })}
    >
      {/* Product Image */}
      <div className="w-full h-52 sm:h-48 md:h-56 lg:h-60 flex items-center justify-center bg-white rounded-2xl mb-4 overflow-hidden">
        <img
          src={product.image || "https://via.placeholder.com/220x220"}
          alt={product.name}
          className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col flex-1">
        <h3 className="text-lg sm:text-base md:text-lg font-semibold text-gray-800 mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-2">
          {product.description || "No description available"}
        </p>

        <p className="text-amber-500 font-bold text-lg sm:text-base md:text-lg">
          ₹{product.price}
        </p>
      </div>

      {/* Rating */}
      <div className="flex items-center mt-2 gap-1">
        {renderStars(avgRating)}
        <span className="text-gray-600 text-sm ml-1">{avgRating.toFixed(1)}</span>
      </div>

      {/* Category / Attributes */}
      <div className="mt-2 text-gray-400 text-xs sm:text-sm flex flex-wrap gap-2">
        {product.category && <span>{product.category}</span>}
        {product.size && <span>Size: {Array.isArray(product.size) ? product.size.join(", ") : product.size}</span>}
        {product.color && <span>Color: {Array.isArray(product.color) ? product.color.join(", ") : product.color}</span>}
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        className="mt-4 self-start bg-amber-200 text-gray-800 px-4 py-2 rounded-full hover:bg-amber-300 transition text-sm font-semibold shadow-sm hover:shadow-md"
      >
        Add to Cart
      </button>
    </div>
  );
};

export default Card;
