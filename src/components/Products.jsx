import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { addToCart } from "./AddToCart";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const Products = ({ searchResults, loading }) => {
  const SkeletonCard = () => (
    <div className="flex flex-col space-y-2 rounded-2xl shadow p-3 animate-pulse">
      <div className="h-[220px] w-full rounded-xl mb-2 border"></div>
      <div className="h-4 rounded w-3/4 mb-1 border"></div>
      <div className="h-4 rounded w-1/2 mb-1 border"></div>
      <div className="h-4 rounded w-1/4 mb-2 border"></div>
      <div className="flex items-center gap-1">
        <div className="h-4 w-4 rounded-full border"></div>
        <div className="h-4 w-6 rounded border"></div>
      </div>
      <div className="h-10 rounded w-full mt-2 border"></div>
    </div>
  );

  const handleAddToCart = (product) => {
    if (auth.currentUser) {
      addToCart(product);
      toast.success(`${product.name || "Product"} added to cart!`);
    } else {
      toast.error("Please login to use the cart");
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
      else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="mt-4 mb-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  if (!searchResults || searchResults.length === 0) {
    return (
      <p className="text-center mt-10 text-gray-500 text-lg">
        No products found
      </p>
    );
  }

  return (
    <div className="mt-4 mb-4">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {searchResults.filter(p => !p.deleted).map((product) => {
            const rating = product.rating ?? 4.5;
            const isSale = rating > 4 || product.sale;
            const salePrice = isSale ? Math.max(product.price - 200, 0) : product.price;

            return (
              <div
                key={product.id}
                className="flex flex-col space-y-2 rounded-2xl shadow hover:shadow-lg transition relative p-4 border"
              >
                {isSale && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    SALE
                  </span>
                )}

                <Link to={`/productdetails/${product.id}`} state={{ product }}>
                  <div className="w-full h-[220px] flex items-center justify-center rounded-2xl overflow-hidden border">
                    <img
                      src={product.image || "https://via.placeholder.com/220x220"}
                      alt={product.name || "Product"}
                      className="max-h-full max-w-full object-contain transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </Link>

                <Link to={`/productdetails/${product.id}`} state={{ product }}>
                  <h3 className="font-semibold text-gray-800 text-md truncate hover:text-amber-500 transition">
                    {product.name || "Unnamed Product"}
                  </h3>
                </Link>

                <p className="text-sm text-gray-600">
                  <span className="font-medium">Colors:</span>{" "}
                  {Array.isArray(product.color) && product.color.length > 0
                    ? product.color.join(", ")
                    : product.color || "N/A"}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Sizes:</span>{" "}
                  {Array.isArray(product.size) && product.size.length > 0
                    ? product.size.join(", ")
                    : product.size || "N/A"}
                </p>

                <p className="text-sm font-medium text-gray-800">
                  {isSale ? (
                    <>
                      <span className="line-through text-gray-400 mr-2">₹{product.price.toFixed(2)}</span>
                      <span className="text-red-500 font-bold">₹{salePrice.toFixed(2)}</span>
                    </>
                  ) : (
                    <>₹{product.price.toFixed(2)}</>
                  )}
                </p>

                <div className="flex items-center gap-1 mt-1">
                  {renderStars(rating)}
                  <span className="text-gray-700 ml-1">{rating.toFixed(1)}</span>
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className="mt-3 px-4 py-2 rounded-full bg-amber-300 text-gray-800 hover:bg-amber-400 transition text-sm font-semibold shadow"
                >
                  Add to Cart
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Products;
