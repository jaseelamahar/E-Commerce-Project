import React from "react";
import { useLocation } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import Card from "./Card";

const SearchResults = () => {
  const { products, loading } = useProducts();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query") || "";

  const filteredProducts = products.filter((product) => {
    const term = query.toLowerCase();

    const nameMatch = product.name?.toLowerCase().includes(term);
    const categoryMatch = product.category?.toLowerCase().includes(term);
    const descriptionMatch = product.description?.toLowerCase().includes(term);

    // Handle color as array or string
    const colorMatch = Array.isArray(product.color)
      ? product.color.some((c) => c.toLowerCase().includes(term))
      : product.color?.toLowerCase().includes(term);

    // Handle size as array or string
    const sizeMatch = Array.isArray(product.size)
      ? product.size.some((s) => s.toLowerCase().includes(term))
      : product.size?.toLowerCase().includes(term);

    return nameMatch || categoryMatch || descriptionMatch || colorMatch || sizeMatch;
  });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        Search Results for: "{query}"
      </h2>

      {loading ? (
        <p>Loading...</p>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found</p>
      )}
    </div>
  );
};

export default SearchResults;
