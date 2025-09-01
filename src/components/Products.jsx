import React from "react";
import { FaStar } from "react-icons/fa6";
import { Link } from "react-router-dom";   // ✅ import Link

const Products = ({ searchResults, loading }) => {
  // Skeleton that mimics your Card layout
  const SkeletonCard = () => (
    <div className="flex flex-col space-y-2 border rounded-lg shadow-md p-3 animate-pulse">
      <div className="h-[220px] w-full bg-gray-300 rounded-md mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-1"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-1"></div>
      <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
      <div className="flex items-center gap-1">
        <div className="h-4 w-4 bg-gray-300 rounded-full"></div>
        <div className="h-4 w-6 bg-gray-300 rounded"></div>
      </div>
      <div className="h-8 bg-gray-300 rounded w-full mt-2"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="mt-4 mb-4">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!searchResults) {
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
          {searchResults.map((product) => (
            <div
              key={product.id}
              className="flex flex-col space-y-2 border rounded-lg shadow-md p-3 hover:shadow-xl transition"
            >
              {/* ✅ Image links to ProductDetails */}
              <Link to={`/productdetails/${product.id}`}>
                <img
                  src={product.image || "https://via.placeholder.com/220x220"}
                  alt={product.name || "Product Image"}
                  className="h-[220px] w-full object-cover rounded-md"
                />
              </Link>

              {/* ✅ Name also links to ProductDetails */}
              <Link to={`/productdetails/${product.id}`}>
                <h3 className="font-semibold text-gray-800 text-md truncate hover:text-amber-600">
                  {product.name || "Unnamed Product"}
                </h3>
              </Link>

              <p className="text-sm text-gray-600">
                <span className="font-medium">Colors:</span>{" "}
                {Array.isArray(product.color) && product.color.length > 0
                  ? product.color.join(", ")
                  : product.color || "No colors"}
              </p>

              <p className="text-sm text-gray-600">
                <span className="font-medium">Sizes:</span>{" "}
                {Array.isArray(product.size) && product.size.length > 0
                  ? product.size.join(", ")
                  : product.size || "No sizes"}
              </p>

              <p className="text-sm font-medium text-gray-800">
                Rs{product.price ? product.price.toFixed(2) : "0.00"}
              </p>

              <div className="flex items-center gap-1 text-yellow-400">
                <FaStar />
                <span className="text-gray-700">{product.rating ?? 4.5}</span>
              </div>

              <button
                onClick={() =>
                  alert(`Added ${product.name || "product"} to cart!`)
                }
                className="mt-6 self-start bg-amber-300 text-gray-800 px-4 py-2 rounded-full hover:bg-amber-400 transition text-sm font-semibold"
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
