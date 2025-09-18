import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate=useNavigate();

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (!currentUser) {
        setUser(null);
        setOrders([]);
        setLoading(false);
        return;
      }

      setUser(currentUser);
      const ordersRef = collection(db, "users", currentUser.uid, "orders");
      const q = query(ordersRef, orderBy("createdAt", "desc"));

      const unsubscribeOrders = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setOrders(data);
          setLoading(false);
        },
        (err) => {
          console.error("Error fetching orders:", err);
          toast.error("Failed to load orders");
          setLoading(false);
        }
      );

      return () => unsubscribeOrders();
    });

    return () => unsubscribeAuth();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    if (!user) return;
    try {
      const orderRef = doc(db, "users", user.uid, "orders", orderId);
      await updateDoc(orderRef, { status });
      toast.success("Order status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update order status");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading orders...</div>;
  if (!user) return <div className="p-6 text-center">Please log in to see your orders.</div>;
  if (!orders.length) return <div className="p-6 text-center">No orders yet.</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-center mb-6">📦 Your Orders</h1>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition flex flex-col gap-4"
        >
          {/* Order Info */}
          <div className="flex justify-between items-center text-sm text-gray-500 mb-2">
            <span>Order ID: <span className="font-medium">{order.id}</span></span>
            <span>{order.createdAt?.toDate().toLocaleDateString() || "—"}</span>
         <button
  onClick={() => navigate(`/dummy-tracking/${order.tracking_number}`)}
  className="text-indigo-600 underline text-sm"
>
  Track Order
</button>
          </div>

          {/* Items */}
          <div className="flex flex-col gap-4 border-t pt-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image || "https://via.placeholder.com/60"}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.selectedSize && <p className="text-gray-500 text-sm">Size: {item.selectedSize}</p>}
                    {item.selectedColor && <p className="text-gray-500 text-sm">Color: {item.selectedColor}</p>}
                    <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-800">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Total & Status */}
          <div className="flex justify-between items-center mt-4">
            <span className="font-bold text-lg">Total:</span>
            <span className="font-bold text-indigo-600 text-lg">₹{order.total.toFixed(2)}</span>
          </div>

          {/* Status */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {order.status === "ordered" && (
              <>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-1">
                  🎉 Ordered
                </span>
                <button
                  onClick={() => updateOrderStatus(order.id, "cancelled")}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm"
                >
                  Cancel
                </button>
              </>
            )}
            {order.status === "confirmed" && (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm flex items-center gap-1">
                ✅ Confirmed
              </span>
            )}
            {order.status === "cancelled" && (
              <span className="px-3 py-1 bg-gray-200 text-gray-700 rounded-full text-sm flex items-center gap-1">
                ❌ Cancelled
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistory;
