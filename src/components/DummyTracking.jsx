import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { FaBox, FaBoxes, FaTruck, FaShippingFast, FaHome } from "react-icons/fa";

const DummyTracking = () => {
  const { trackingNumber } = useParams();
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const stages = [
    { name: "Order Received", icon: <FaBox /> },
    { name: "Packed", icon: <FaBoxes /> },
    { name: "Picked Up", icon: <FaTruck /> },
    { name: "In Transit", icon: <FaShippingFast /> },
    { name: "Out for Delivery", icon: <FaTruck /> },
    { name: "Delivered", icon: <FaHome /> },
  ];

  const stageMessages = {
    "Order Received": "Your order has been placed successfully.",
    Packed: "Your order is packed and ready for shipment.",
    "Picked Up": "Courier has picked up your package.",
    "In Transit": "Your package is on its way.",
    "Out for Delivery": "Courier is out for delivery.",
    Delivered: "Your package has been delivered.",
    Cancelled: "This order has been cancelled.",
  };

  useEffect(() => {
    const usersRef = collection(db, "users");
    const unsubscribeUsers = onSnapshot(usersRef, (usersSnapshot) => {
      let foundTracking = false;
      const unsubOrdersList = [];

      usersSnapshot.forEach((userDoc) => {
        const ordersRef = collection(db, "users", userDoc.id, "orders");
        const unsubOrders = onSnapshot(ordersRef, (ordersSnapshot) => {
          ordersSnapshot.forEach((orderDoc) => {
            const data = orderDoc.data();
            if (data.tracking_number === trackingNumber) {
              setTrackingInfo({
                orderId: orderDoc.id,
                userId: userDoc.id,
                tracking_number: data.tracking_number,
                status: data.status,
                tracking_status: data.tracking_status || "Order Received",
                estimatedDelivery: data.estimatedDelivery || "3-5 business days",
              });
              foundTracking = true;
            }
          });
          if (!foundTracking) setTrackingInfo(null);
          setLoading(false);
        });
        unsubOrdersList.push(unsubOrders);
      });

      return () => unsubOrdersList.forEach((unsub) => unsub());
    });

    return () => unsubscribeUsers();
  }, [trackingNumber]);

  // Auto-update dummy tracking
  useEffect(() => {
    if (!trackingInfo) return;
    if (trackingInfo.tracking_status === "Delivered" || trackingInfo.tracking_status === "Cancelled") return;

    const interval = setInterval(async () => {
      const currentIndex = stages.findIndex(s => s.name === trackingInfo.tracking_status);
      const nextStatus = stages[currentIndex + 1]?.name;
      if (!nextStatus) {
        clearInterval(interval);
        return;
      }
      const orderRef = doc(db, "users", trackingInfo.userId, "orders", trackingInfo.orderId);
      await updateDoc(orderRef, { tracking_status: nextStatus });
      setTrackingInfo(prev => ({ ...prev, tracking_status: nextStatus }));
    }, 15000);

    return () => clearInterval(interval);
  }, [trackingInfo]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-gray-800 rounded-full animate-spin mb-4"></div>
        <p className="text-gray-600 text-lg">Loading tracking info...</p>
      </div>
    );
  }

  if (!trackingInfo) {
    return (
      <div className="p-6 text-center text-gray-500 bg-gray-50 min-h-screen flex flex-col justify-center">
        Tracking info not found
        <Link to="/orderhistory" className="mt-4 text-blue-600 underline">
          Back to Orders
        </Link>
      </div>
    );
  }

  const currentStageIndex = trackingInfo.tracking_status === "Cancelled" ? -1 : stages.findIndex(s => s.name === trackingInfo.tracking_status);

  const getStageColor = (index) => {
    if (trackingInfo.tracking_status === "Cancelled") return "bg-red-500 text-white";
    if (index < currentStageIndex) return "bg-green-500 text-white";
    if (index === currentStageIndex) return "bg-blue-500 text-white";
    return "bg-gray-200 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      {/* Minimal Header */}
      <div className="w-full max-w-xl flex justify-between items-center mb-6">

        <Link to="/orderhistory" className="text-blue-600 underline hover:text-blue-800">
          Back to Orders
        </Link>
      </div>

      <div className="p-6 max-w-xl bg-white shadow rounded w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">📦 Track Your Order</h2>
        <p className="text-sm text-gray-600 text-center mb-2">
          Tracking Number: <strong>{trackingInfo.tracking_number}</strong>
        </p>
        <p className="text-lg font-semibold text-center mb-4">
          Status:{" "}
          <span className={trackingInfo.tracking_status === "Cancelled"
            ? "text-red-600"
            : trackingInfo.tracking_status === "Delivered"
              ? "text-green-600"
              : "text-blue-500"
          }>
            {trackingInfo.tracking_status}
          </span>
        </p>
        <p className="text-gray-500 text-sm text-center mb-6">
          Estimated Delivery: <strong>{trackingInfo.estimatedDelivery}</strong>
        </p>

        {/* Vertical Timeline */}
        <div className="relative flex flex-col items-start gap-6 pl-8">
          {stages.map((stage, index) => (
            <div key={stage.name} className="flex items-start gap-4 relative">
              {index !== 0 && (
                <span className={`absolute left-4 top-0 h-full w-0.5 ${index <= currentStageIndex ? "bg-green-500" : "bg-gray-300"}`}></span>
              )}
              <div className={`p-3 rounded-full flex items-center justify-center ${getStageColor(index)}`} style={{ minWidth: "40px", minHeight: "40px", zIndex: 10 }}>
                {stage.icon}
              </div>
              <div>
                <p className="font-semibold">{stage.name}</p>
                {index === currentStageIndex && (
                  <p className="text-sm text-gray-600">{stageMessages[stage.name]}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-gray-600">
          {trackingInfo.tracking_status === "Cancelled"
            ? stageMessages["Cancelled"]
            : trackingInfo.tracking_status === "Delivered"
              ? stageMessages["Delivered"]
              : "Your package is on its way and updates automatically."}
        </p>
      </div>
    </div>
  );
};

export default DummyTracking;
