
import { useEffect, useState, useRef } from "react";
import { auth, db } from "../firebase";
import { collection, doc, onSnapshot, updateDoc, deleteDoc, addDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const toastShown = useRef(false); // <- prevents duplicate toast

useEffect(() => {
  const user = auth.currentUser;

  if (!user) {
    if (!toastShown.current) {
      toast.info("Please login to see your cart");
      toastShown.current = true;
    }
    navigate("/login");
    return; // ✅ Important: exit early to avoid null user
  }


    const cartRef = collection(db, "users", user.uid, "cart");
    const unsubscribeCart = onSnapshot(cartRef, (snapshot) => {
      const items = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(items);
      setLoading(false);
    });

    const ordersRef = collection(db, "users", user.uid, "orders");
    const unsubscribeOrders = onSnapshot(ordersRef, (snapshot) => {
      const orderList = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.createdAt?.toMillis() - a.createdAt?.toMillis());
      setOrders(orderList);
    });

    return () => {
      unsubscribeCart();
      unsubscribeOrders();
    };
  }, [navigate]);

  const incrementQuantity = async (item) => {
    const itemRef = doc(db, "users", auth.currentUser.uid, "cart", item.id);
    await updateDoc(itemRef, { quantity: item.quantity + 1 });
  };

  const decrementQuantity = async (item) => {
    const itemRef = doc(db, "users", auth.currentUser.uid, "cart", item.id);
    if (item.quantity > 1) {
      await updateDoc(itemRef, { quantity: item.quantity - 1 });
    } else {
      await deleteDoc(itemRef);
    }
  };

  const removeItem = async (item) => {
    const itemRef = doc(db, "users", auth.currentUser.uid, "cart", item.id);
    await deleteDoc(itemRef);
  };

  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const placeOrder = async () => {
    const user = auth.currentUser;
    if (!user || cartItems.length === 0) return;

    const ordersRef = collection(db, "users", user.uid, "orders");
    await addDoc(ordersRef, {
      items: cartItems,
      total: totalPrice,
      status: "ordered",
      createdAt: serverTimestamp(),
    });

    // Clear cart
    for (const item of cartItems) {
      await deleteDoc(doc(db, "users", user.uid, "cart", item.id));
    }

    toast.success("Order placed successfully!");
  };

  if (loading) return <div className="p-6 text-center">Loading cart...</div>;
  if (!cartItems.length && !orders.length) return <div className="p-6 text-center">Your cart is empty.</div>;

  return (
    <div className="container mx-auto p-6">
      <ToastContainer position="top-right" autoClose={3000} />
      
      <h2 className="text-3xl font-bold mb-6">Your Cart</h2>

      {cartItems.length > 0 && (
        <div className="flex flex-col gap-4 mb-6">
          {cartItems.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row items-center justify-between border p-4 rounded-lg shadow-sm gap-4">
              <img src={item.image} alt={item.name} className="w-32 h-32 object-cover rounded-lg" />
              <div className="flex-1 flex flex-col gap-2">
                <h3 className="text-xl font-semibold">{item.name}</h3>
                <p className="text-gray-600">Rs{item.price.toFixed(2)}</p>
                <div className="flex items-center gap-2">
                  <button onClick={() => decrementQuantity(item)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">-</button>
                  <span className="px-3 py-1 border rounded">{item.quantity}</span>
                  <button onClick={() => incrementQuantity(item)} className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">+</button>
                  <button onClick={() => removeItem(item)} className="ml-4 text-red-500 hover:text-red-700">Remove</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="mt-6 flex justify-end items-center gap-6">
          <h3 className="text-2xl font-bold">Total: Rs{totalPrice.toFixed(2)}</h3>
          <button
            onClick={placeOrder}
            className="bg-amber-300 text-white px-6 py-2 rounded-full hover:bg-amber-400 transition"
          >
            Order Now
          </button>
        </div>
      )}

      {orders.length > 0 && (
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-4">Order History</h2>
          {orders.map((order) => (
            <div key={order.id} className="border p-4 rounded-lg shadow-sm mb-4">
              <h3 className="font-semibold">Order ID: {order.id}</h3>
              <p>Total: ${order.total.toFixed(2)}</p>
              <p className="text-gray-500 text-sm">Ordered on: {order.createdAt?.toDate().toLocaleString()}</p>

              <div className="mt-2">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between border-b py-1">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex gap-2">
                {order.status === "ordered" && (
                  <button className="px-4 py-1 bg-blue-500 text-white rounded">Ordered</button>
                )}
                {order.status === "confirmed" && (
                  <button className="px-4 py-1 bg-green-500 text-white rounded">Confirmed</button>
                )}
                {order.status === "cancelled" && (
                  <button className="px-4 py-1 bg-red-500 text-white rounded">Cancelled</button>
                )}
                {order.status === "available" && (
                  <button className="px-4 py-1 bg-green-500 text-white rounded">Available</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
