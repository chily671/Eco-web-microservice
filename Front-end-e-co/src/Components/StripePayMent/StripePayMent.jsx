import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaPinterest, FaPrint, FaTruck } from "react-icons/fa";
import { MdStar } from "react-icons/md";

const CheckoutSuccess = () => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showFeedbackSuccess, setShowFeedbackSuccess] = useState(false);

  const orderDetails = {
    orderNumber: "ORD-2024-1234",
    totalAmount: 299.99,
    trackingNumber: "TRK789012345",
    items: [
      { id: 1, name: "Premium Wireless Headphones", price: 199.99, quantity: 1 },
      { id: 2, name: "Protective Case", price: 49.99, quantity: 2 }
    ],
    shippingAddress: {
      name: "John Doe",
      street: "123 Main Street",
      city: "New York",
      state: "NY",
      zip: "10001"
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = (platform) => {
    const message = `Just made an awesome purchase! Order #${orderDetails.orderNumber}`;
    let url = "";

    switch (platform) {
      case "facebook":
        url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
        break;
      case "twitter":
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
        break;
      case "pinterest":
        url = `https://pinterest.com/pin/create/button/?url=${window.location.href}`;
        break;
      default:
        break;
    }

    if (url) window.open(url, "_blank");
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    setShowFeedbackSuccess(true);
    setTimeout(() => setShowFeedbackSuccess(false), 3000);
    setFeedback("");
    setRating(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Success Header */}
          <div className="bg-green-500 p-6 text-center">
            <div className="animate-bounce mb-4">
              <svg className="w-16 h-16 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">Order Successful!</h1>
            <p className="text-white mt-2">Thank you for your purchase</p>
          </div>

          {/* Order Summary */}
          <div className="p-6">
            <div className="border-b pb-6">
              <h2 className="text-2xl font-semibold text-gray-800">Order Summary</h2>
              <p className="text-gray-600 mt-2">Order #: {orderDetails.orderNumber}</p>
              
              <div className="mt-4 space-y-4">
                {orderDetails.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-800 font-medium">{item.name}</p>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="text-gray-800">${item.price.toFixed(2)}</p>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span>Total</span>
                    <span>${orderDetails.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Details */}
            <div className="mt-6 border-b pb-6">
              <h3 className="text-xl font-semibold text-gray-800">Shipping Details</h3>
              <div className="mt-4 text-gray-600">
                <p>{orderDetails.shippingAddress.name}</p>
                <p>{orderDetails.shippingAddress.street}</p>
                <p>
                  {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state} {orderDetails.shippingAddress.zip}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-4">
              <button
                onClick={() => window.open(`/track-order/${orderDetails.trackingNumber}`, "_blank")}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaTruck className="mr-2" />
                Track Order
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <FaPrint className="mr-2" />
                Print Order
              </button>
            </div>

            {/* Social Sharing */}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Share your purchase</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => handleShare("facebook")}
                  className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                >
                  <FaFacebook size={24} />
                </button>
                <button
                  onClick={() => handleShare("twitter")}
                  className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors"
                >
                  <FaTwitter size={24} />
                </button>
                <button
                  onClick={() => handleShare("pinterest")}
                  className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                >
                  <FaPinterest size={24} />
                </button>
              </div>
            </div>

            {/* Feedback Form */}
            <div className="mt-6 border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Rate your experience</h3>
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`text-2xl ${star <= rating ? "text-yellow-400" : "text-gray-300"}`}
                    >
                      <MdStar />
                    </button>
                  ))}
                </div>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your feedback with us..."
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows="4"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Submit Feedback
                </button>
              </form>
              {showFeedbackSuccess && (
                <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-lg">
                  Thank you for your feedback!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutSuccess;