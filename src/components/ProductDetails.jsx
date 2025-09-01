import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { addToCart } from "./AddToCart";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProduct({ id: docSnap.id, ...docSnap.data() });
      } else {
        console.log("No such product!");
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  if (loading)
    return <div className="p-6 text-center text-gray-500">Loading...</div>;
  if (!product)
    return (
      <div className="p-6 text-center text-red-500">Product not found.</div>
    );

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-col md:flex-row gap-8 bg-white p-6 rounded-lg shadow-md">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 h-96 object-cover rounded-lg border"
        />

        {/* Product Details */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              {product.name}
            </h2>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-amber-500 text-2xl font-bold">
              Rs {product.price}
            </p>

            <div className="flex flex-wrap gap-3 mt-4">
              {/* Category */}
              <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-medium text-sm inline-block w-fit">
                {product.category}
              </span>

              {/* Sizes */}
              {(() => {
                try {
                  if (Array.isArray(product.size) && product.size.length > 0) {
                    return (
                      <div className="flex flex-col gap-1">
                        <span className="text-gray-500 font-medium text-sm">
                          Available Sizes:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {product.size.map((s, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium text-sm"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  } else if (product.size) {
                    return (
                      <p className="text-gray-600">Size: {product.size}</p>
                    );
                  }
                  return null;
                } catch (error) {
                  console.error("Error rendering sizes:", error);
                  return (
                    <p className="text-red-500">Size info unavailable</p>
                  );
                }
              })()}

              {/* Colors */}
              {(() => {
                try {
                  if (Array.isArray(product.color) && product.color.length > 0) {
                    return (
                      <div className="flex flex-col gap-1 mt-3">
                        <span className="text-gray-500 font-medium text-sm">
                          Available Colors:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {product.color.map((c, idx) => {
                            const colorName = c.toLowerCase();
                            // Simple contrast for text color
                            const textColor =
                              colorName === "white" || colorName === "#fff"
                                ? "#000"
                                : "#fff";
                            return (
                              <span
                                key={idx}
                                className="px-3 py-1 rounded-full font-medium text-sm border"
                                style={{
                                  backgroundColor: colorName,
                                  color: textColor,
                                }}
                              >
                                {c}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  } else if (product.color) {
                    return <p className="text-gray-600">Color: {product.color}</p>;
                  }
                  return null;
                } catch (error) {
                  console.error("Error rendering colors:", error);
                  return <p className="text-red-500">Color info unavailable</p>;
                }
              })()}
            </div>
          </div>

          {/* Add to Cart */}
          <button
            className="mt-6 self-start bg-amber-300 text-gray-800 px-4 py-2 rounded-full hover:bg-amber-400 transition text-sm font-semibold"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
