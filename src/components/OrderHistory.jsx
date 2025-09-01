import { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, onSnapshot, orderBy, query, doc, updateDoc } from "firebase/firestore";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribeOrders = () => {};

    const unsubscribeAuth = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        const ordersRef = collection(db, "users", currentUser.uid, "orders");
        const q = query(ordersRef, orderBy("createdAt", "desc"));

        unsubscribeOrders = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({
            id: doc.id,
            status: doc.data().status || "pending",
            ...doc.data(),
          }));
          setOrders(data);
          setLoading(false);
        });
      } else {
        setUser(null);
        setOrders([]);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeOrders();
    };
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    if (!user) return;
    const orderRef = doc(db, "users", user.uid, "orders", orderId);
    await updateDoc(orderRef, { status });
  };

  if (loading) return <div className="p-6 text-center">Loading orders...</div>;
  if (!user) return <div className="p-6 text-center">Please log in to see your orders.</div>;
  if (!orders.length) return <div className="p-6 text-center">No orders yet.</div>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Order History</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white border rounded-2xl shadow-lg p-4 hover:shadow-xl transition flex flex-col"
          >
            {/* Order Info */}
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span className="font-semibold">Order ID:</span>
              <span className="truncate max-w-[120px]">{order.id}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600 mb-3">
              <span className="font-semibold">Date:</span>
              <span>{order.createdAt?.toDate().toLocaleDateString()}</span>
            </div>

            {/* Order Items */}
            <div className="border-t pt-3 space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image || "https://via.placeholder.com/60"}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-gray-500 text-sm">
                        Qty: {item.quantity} | Size: {Array.isArray(item.size) ? item.size.join(", ") : item.size || "N/A"}
                      </p>
                      {item.color && <p className="text-gray-500 text-sm">Color: {item.color}</p>}
                    </div>
                  </div>
                  <span className="font-semibold text-gray-800">
                    Rs{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="mt-4 flex justify-between items-center font-bold text-base">
              <span>Total:</span>
              <span className="text-indigo-600">Rs{order.total.toFixed(2)}</span>
            </div>

            {/* Status Buttons */}
            <div className="mt-4 flex gap-2">
              {order.status === "pending" && (
                <button
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                  onClick={() => updateOrderStatus(order.id, "confirmed")}
                >
                  Available
                </button>
              )}
              {order.status === "confirmed" && (
                <button
                  className="flex-1 px-4 py-2 bg-blue-400 text-white rounded cursor-not-allowed"
                  disabled
                >
                  Ordered
                </button>
              )}
              {order.status === "cancelled" && (
                <span className="flex-1 px-4 py-2 bg-red-500 text-white rounded text-center">
                  Cancelled
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
