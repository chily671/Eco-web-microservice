import React, { useState, useEffect, useContext } from "react";
import { FiSearch, FiEdit2, FiTrash2, FiEye, FiCheck } from "react-icons/fi";
import {ShopContext} from "../../Context/ShopContext";
import Modal from "react-modal";

const AdminOrderDashboard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const {all_product} = useContext(ShopContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState("");

  const customStyles = {
    content: {
      width: "50%", // Điều chỉnh chiều rộng của modal
      height: "50%", // Điều chỉnh chiều cao của modal
      top: "50%", // Dịch modal xuống dưới 50% của viewport
      left: "50%", // Dịch modal sang phải 50% của viewport
      transform: "translate(-50%, -50%)", // Dịch modal để nó căn giữa
    },
  };

  const [viewOrderProduct, setViewOrderProduct] = useState({ products: {} });
  const [allOrders, setAllOrders] = useState([]);
  const getAllOrders = async () => {
    const response = await fetch("/order/allorder", {
      method: "GET",
      headers: {
        Accept: "application/form-data",
        "auth-token": `${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    setAllOrders(data);
  };

  useEffect(
    () => async () => {
      await getAllOrders();
    },
    []
  );

  const handleConfirm = async (id) => {
    const confirmResponse = await fetch("/order/confirmorder", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "auth-token": `${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    });

    const confirmData = await confirmResponse.json();

    if (!confirmData.success) {
      alert("Order Confirmation Failed");
    }
    await getAllOrders();
  };

  
  

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setError("Please enter at least 2 characters");
    } else {
      setError("");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleOpenModal = (orderProducts) => {
    if (orderProducts) {
      setViewOrderProduct(orderProducts);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  function ProductListModal({ orders, isOpen, onRequestClose }) {
    return (
      <Modal
        isOpen={isOpen}
        style={customStyles}
        onRequestClose={onRequestClose}
        contentLabel="Product List Modal"
      >
        <div className="title-modal">
          <h2>{orders._id}</h2>
          <button onClick={onRequestClose}>Close</button>
        </div>
        <p>Fullname: {orders.fullname}</p>
        <p>Time: {orders.time}</p>
        <p>Total: {orders.total}</p>
        <p>Status: {orders.status}</p>
        <table className="modal-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Price</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {all_product.map((product, i) => {
              if (product.id in orders.products) {
                return (
                  <tr key={i}>
                    <td>
                      <img src={product.image} />
                    </td>
                    <td>{product.name}</td>
                    <td>${product.price}</td>
                    <td className="quantity-column">
                      {orders.products[product.id]}
                    </td>
                  </tr>
                );
              } else {
                return null;
              }
            })}
          </tbody>
        </table>
      </Modal>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6 space-y-4">
        <h1 className="text-2xl font-bold text-gray-800">Order Management Dashboard</h1>
        
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              aria-label="Search orders"
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Order ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order) => (
              <tr
                key={order.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-3 text-sm text-gray-900">{order.id}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{order.fullname}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{order.orderDate}</td>
                <td className="px-4 py-3 text-sm text-gray-900">{order.total}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex space-x-2">
                    <button
                      className="p-1 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      aria-label="View order details"
                      title="View Details"
                    >
                      <FiEye className="w-5 h-5" onClick={() => handleOpenModal(order)} />
                    </button>
                    <button
                      className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                      aria-label="Edit order"
                      title="Edit Order"
                      
                    >
                      <FiEdit2 className="w-5 h-5" />
                    </button>
                    <button
                      className="p-1 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      aria-label="Delete order"
                      title="Delete Order"
                    >
                      <FiTrash2 className="w-5 h-5" />
                    </button>
                    {order.status !== "completed" && (
                      <button
                        className="p-1 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                        aria-label="Mark as complete"
                        title="Mark Complete"
                      >
                        <FiCheck className="w-5 h-5" onClick={() => handleConfirm(order.id)} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <ProductListModal
        orders={viewOrderProduct}
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
      />
      </div>
    </div>
  );
};

export default AdminOrderDashboard;