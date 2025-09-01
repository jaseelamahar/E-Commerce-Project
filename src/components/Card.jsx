import React from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegStar } from "react-icons/fa";

const Card = ({ product }) => {
  const navigate = useNavigate();

  // Calculate average rating
  const ratings = product.ratings || []; // array of numbers
  const avgRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
      : 0;

  return (
    <div
      className="border rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col cursor-pointer"
      onClick={() => navigate(`/productdetails/${product.id}`)}
    >
      {/* Product Image */}
      <img
        src={product.image || "https://via.placeholder.com/220x220"}
        alt={product.name}
        className="w-full h-48 object-cover rounded-md mb-4"
      />

      {/* Product Info */}
      <div className="flex flex-col flex-1">
        <h3 className="text-lg font-semibold mb-1">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-2">{product.description}</p>
        <p className="text-amber-500 font-bold text-lg">Rs{product.price}</p>
      </div>

      {/* Average Rating */}
      <div className="flex items-center mt-2 gap-1">
        {[1, 2, 3, 4, 5].map((star) =>
          star <= Math.round(avgRating) ? (
            <FaStar key={star} className="text-yellow-400" />
          ) : (
            <FaRegStar key={star} className="text-gray-300" />
          )
        )}
        <span className="text-gray-600 text-sm ml-2">
          ({ratings.length})
        </span>
      </div>

      {/* Optional: Category / Size / Color */}
      <div className="mt-2 text-gray-400 text-sm flex flex-wrap gap-2">
        <span>{product.category}</span>
        {product.size && <span>Size: {Array.isArray(product.size) ? product.size.join(", ") : product.size}</span>}
        {product.color && <span>Color: {Array.isArray(product.color) ? product.color.join(", ") : product.color}</span>}
      </div>
    </div>
  );
};

export default Card;
