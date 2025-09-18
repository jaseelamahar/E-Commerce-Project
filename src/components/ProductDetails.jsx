import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { doc, onSnapshot, collection, query, where, getDocs, limit } from "firebase/firestore";
import { db, auth } from "../firebase";
import { addToCart } from "./AddToCart";
import { toast } from "react-toastify";
import Card from "./Card"; // ✅ for related products

const ProductDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const passedProduct = location.state?.product;

  const [product, setProduct] = useState(passedProduct || null);
  const [loading, setLoading] = useState(!passedProduct);
  const [relatedProducts, setRelatedProducts] = useState([]);

  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // Fetch single product
  useEffect(() => {
    if (!passedProduct) {
      const docRef = doc(db, "products", id);
      const unsubscribe = onSnapshot(
        docRef,
        (docSnap) => {
          if (docSnap.exists()) {
            setProduct({ id: docSnap.id, ...docSnap.data() });
          } else {
            setProduct(null);
          }
          setLoading(false);
        },
        (error) => {
          console.error("Error fetching product:", error);
          setLoading(false);
        }
      );
      return () => unsubscribe();
    }
  }, [id, passedProduct]);

  // Fetch related products
  useEffect(() => {
    if (product?.category) {
      const fetchRelated = async () => {
        try {
          const q = query(
            collection(db, "products"),
            where("category", "==", product.category),
            limit(6)
          );
          const querySnap = await getDocs(q);
          const related = [];
          querySnap.forEach((docSnap) => {
            if (docSnap.id !== product.id) {
              related.push({ id: docSnap.id, ...docSnap.data() });
            }
          });
          setRelatedProducts(related);
        } catch (err) {
          console.error("Error fetching related products:", err);
        }
      };
      fetchRelated();
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!auth.currentUser) {
      toast.error("Please login to use the cart");
      return;
    }
    if (!selectedColor || !selectedSize) {
      toast.error("Please select color and size");
      return;
    }
    addToCart({ ...product, selectedColor, selectedSize });
    toast.success(`${product.name || "Product"} added to cart!`);
  };

  if (!product) {
    return loading ? (
      <div className="p-6 text-center text-gray-500">Loading...</div>
    ) : (
      <div className="p-6 text-center text-red-500">Product not found.</div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-white rounded-2xl shadow-xl p-6">
        {/* Product Image */}
        <div className="flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-h-[500px] object-contain rounded-lg transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* Product Info */}
        <div className="flex flex-col justify-between">
          {/* Title & Price */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-tight">
              {product.name}
            </h1>
            <p className="text-amber-500 text-2xl font-bold">₹{product.price}</p>
          </div>

          {/* Premium Description */}
          <div className="mt-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-700">Product Description</h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base border-l-4 border-amber-400 pl-4 italic">
              {product.description ||
                "Experience comfort and style with our premium selection."}
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-1 text-sm md:text-base">
              <li>High-quality fabric with durable stitching</li>
              <li>Designed for both casual and formal wear</li>
              <li>Easy to wash and maintain</li>
            </ul>
          </div>

          {/* Sizes */}
          {Array.isArray(product.size) && product.size.length > 0 && (
            <div className="mt-6">
              <span className="text-gray-700 font-medium text-sm block mb-2">Select Size</span>
              <div className="flex flex-wrap gap-3">
                {product.size.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(s)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                      selectedSize === s
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors */}
          {Array.isArray(product.color) && product.color.length > 0 && (
            <div className="mt-6">
              <span className="text-gray-700 font-medium text-sm block mb-2">Select Color</span>
              <div className="flex flex-wrap gap-3">
                {product.color.map((c, idx) => {
                  const colorName = c.toLowerCase();
                  const textColor =
                    colorName === "white" || colorName === "#fff" ? "#000" : "#fff";
                  return (
                    <button
                      key={idx}
                      onClick={() => setSelectedColor(c)}
                      className={`w-10 h-10 rounded-full shadow-md border-2 transition ${
                        selectedColor === c
                          ? "ring-4 ring-amber-400"
                          : "hover:scale-110"
                      }`}
                      style={{ backgroundColor: colorName, color: textColor }}
                      title={c}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Add to Cart */}
         {/* Add to Cart */}
<button
  onClick={handleAddToCart}
  className="mt-4 self-start bg-amber-300 text-gray-800 px-3 py-1.5 rounded-full hover:bg-amber-400 transition text-sm font-semibold"
>
  Add to Cart
</button>

        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">You may also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <Card key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
