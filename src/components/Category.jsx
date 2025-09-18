import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Card from "./Card";

const Category = () => {
  const { categoryName } = useParams(); // use name
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    let q;
    if (categoryName === "Top Rated") {
      q = query(collection(db, "products"), where("topRated", "==", true));
    } else if (categoryName === "Sale") {
      q = query(collection(db, "products"), where("sale", "==", true));
    } else {
      q = query(collection(db, "products"), where("category", "==", categoryName));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const productList = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((p) => !p.deleted);
        setProducts(productList);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [categoryName]);

  const SkeletonCard = () => (
    <div className="border p-4 rounded-lg shadow-sm animate-pulse">
      <div className="bg-gray-300 h-40 w-full rounded mb-4"></div>
      <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-300 rounded w-1/4"></div>
        <div className="h-8 bg-gray-300 rounded w-16"></div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">{categoryName}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          : products.length > 0
          ? products.map((product) => <Card key={product.id} product={product} />)
          : <p className="text-gray-500">No products found</p>}
      </div>
    </div>
  );
};

export default Category;
