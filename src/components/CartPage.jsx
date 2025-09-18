import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  query,
  orderBy
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [latestOrderId, setLatestOrderId] = useState(null);
  const [hasOrders, setHasOrders] = useState(false);
  const navigate = useNavigate();

  // Fetch cart items
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      toast.info("Please login to see your cart", { toastId: "login-toast" });
      navigate("/login");
      return;
    }

    // Cart
    const cartRef = collection(db, "users", user.uid, "cart");
    const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setCartItems(items);
      setLoading(false);
    });

    // Check if user has previous orders
    const ordersRef = collection(db, "users", user.uid, "orders");
    const q = query(ordersRef, orderBy("createdAt", "desc"));
    const unsubscribeOrders = onSnapshot(q, (snapshot) => {
      setHasOrders(snapshot.docs.length > 0);
    });

    return () => {
      unsubscribeCart();
      unsubscribeOrders();
    };
  }, [navigate]);

  const increment = async (item) => {
    const ref = doc(db, "users", auth.currentUser.uid, "cart", item.id);
    await updateDoc(ref, { quantity: item.quantity + 1 });
  };

  const decrement = async (item) => {
    const ref = doc(db, "users", auth.currentUser.uid, "cart", item.id);
    if (item.quantity > 1) await updateDoc(ref, { quantity: item.quantity - 1 });
    else await deleteDoc(ref);
  };

  const removeItem = async (item) => {
    const ref = doc(db, "users", auth.currentUser.uid, "cart", item.id);
    await deleteDoc(ref);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (!auth.currentUser || cartItems.length === 0) {
      toast.error("Cart is empty or you are not logged in");
      return;
    }

    try {
      const tracking = "TRK" + Math.floor(Math.random() * 1000000);
      setTrackingNumber(tracking);

      const ordersRef = collection(db, "users", auth.currentUser.uid, "orders");
      const docRef = await addDoc(ordersRef, {
        items: cartItems,
        total: totalPrice,
        email: auth.currentUser.email,
        status: "pending",
        tracking_number: tracking,
        tracking_status: "Pending",
        createdAt: serverTimestamp(),
      });

      setLatestOrderId(docRef.id);
      setShowModal(true);
    } catch (error) {
      console.error("🔥 Error placing order:", error);
      toast.error("Failed to place order. Check console for details.");
    }
  };

  const handleConfirmOrder = async () => {
    if (!latestOrderId) return;

    const orderRef = doc(db, "users", auth.currentUser.uid, "orders", latestOrderId);
    await updateDoc(orderRef, {
      status: "confirmed",
      tracking_status: "In Transit",
    });

    if (cartItems.length > 0) {
      await Promise.all(
        cartItems.map((item) =>
          deleteDoc(doc(db, "users", auth.currentUser.uid, "cart", item.id))
        )
      );
      setCartItems([]);
    }

    setShowModal(false);
    toast.success("Order Confirmed ✅");
    navigate("/orderhistory");
  };

  const handleCancelOrder = async () => {
    if (!latestOrderId) return;

    const orderRef = doc(db, "users", auth.currentUser.uid, "orders", latestOrderId);
    await updateDoc(orderRef, {
      status: "cancelled",
      tracking_status: "Cancelled",
    });

    setShowModal(false);
    toast.info("Order Cancelled ❌");
  };

  if (loading) return <div className="text-center p-6">Loading your cart...</div>;

  // Empty cart message with Happy Shopping
  if (cartItems.length === 0) {
    return (
      <div className="text-center p-6 text-gray-500 flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold">Your cart is empty 🛍️</h2>
        <p>Happy shopping! Explore our latest collection 👔</p>
        {hasOrders && (
          <button
            onClick={() => navigate("/orderhistory")}
            className="bg-gray-200 text-gray-900 px-4 py-1 rounded-full hover:bg-gray-300 transition text-sm font-medium"
          >
            View Orders
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col gap-6">
      <ToastContainer />
      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>

      {hasOrders && (
        <button
          onClick={() => navigate("/orderhistory")}
          className="bg-gray-200 text-gray-900 px-3 py-1 rounded-full hover:bg-gray-300 transition text-xs font-medium mb-4 w-max"
        >
          View Orders
        </button>
      )}

      {cartItems.map((item) => (
        <div
          key={item.id}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border rounded-2xl shadow-md hover:shadow-xl transition bg-white"
        >
          <img src={item.image} alt={item.name} className="w-28 h-28 object-cover rounded-xl" />
          <div className="flex-1 flex flex-col gap-1 text-center sm:text-left">
            <h3 className="font-semibold text-lg">{item.name}</h3>
            {item.selectedColor && <span>Color: {item.selectedColor}</span>}
            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => decrement(item)}
              className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              -
            </button>
            <span className="px-3 py-1 border rounded-full">{item.quantity}</span>
            <button
              onClick={() => increment(item)}
              className="px-3 py-1 bg-gray-100 rounded-full hover:bg-gray-200 transition"
            >
              +
            </button>
          </div>
          <div className="flex flex-col items-center sm:items-end gap-1">
            <span className="font-bold text-lg">₹{(item.price * item.quantity).toFixed(2)}</span>
            <button
              onClick={() => removeItem(item)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <h2 className="text-2xl font-bold">Total: ₹{totalPrice.toFixed(2)}</h2>
        <button
          onClick={placeOrder}
          className="bg-amber-400 text-gray-900 px-6 py-2 rounded-full hover:bg-amber-500 transition font-semibold text-lg"
        >
          Place Order
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
          <div className="bg-white rounded-3xl p-8 max-w-md text-center">
            <h2 className="text-2xl font-bold mb-2">👔 Order Placed!</h2>
            <p className="mb-2">Once order is shipped, you cannot cancel.</p>
            
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmOrder}
                className="px-6 py-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition font-medium"
              >
                Confirm
              </button>
              <button
                onClick={handleCancelOrder}
                className="px-6 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
