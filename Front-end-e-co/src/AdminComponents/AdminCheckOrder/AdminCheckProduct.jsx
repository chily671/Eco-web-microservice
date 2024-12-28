import React, { useEffect, useState, useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";
import Modal from "react-modal";

const AdminCheckOrder = () => {
  const customStyles = {
    content: {
      width: "50%", // Điều chỉnh chiều rộng của modal
      height: "50%", // Điều chỉnh chiều cao của modal
      top: "50%", // Dịch modal xuống dưới 50% của viewport
      left: "50%", // Dịch modal sang phải 50% của viewport
      transform: "translate(-50%, -50%)", // Dịch modal để nó căn giữa
    },
  };

  const { all_product } = useContext(ShopContext);
  const [viewOrderProduct, setViewOrderProduct] = useState({ products: {} });

  const [isModalOpen, setModalOpen] = useState(false);

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

  const handleOpenModal = (orderProducts) => {
    if (orderProducts) {
      setViewOrderProduct(orderProducts);
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleConfirm = async (id) => {
    const confirmResponse = await fetch("/confirmorder", {
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

  const handleDelete = (id) => {};

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
    <div className="table-container">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">NAME</th>
            <th scope="col">PRICE</th>
            <th scope="col">PAYMENT</th>
            <th scope="col">STATUS</th>
            <th scope="col">ACTION</th>
          </tr>
        </thead>
        <tbody>
          {allOrders.map((order, index) => (
            <tr>
              <th scope="row" key={index}>
                {order.id}
              </th>
              <td>{order.fullname}</td>
              <td>{order.total}</td>
              <td>{order.payment}</td>
              <td>{order.status}</td>
              <td>
                <button
                  className="btn btn-info mx-2"
                  onClick={() => handleOpenModal(order)}
                >
                  View
                </button>
                {order.status == "Pending" ? (
                  <button
                    className="btn btn-outline-primary mx-2"
                    onClick={() => handleConfirm(order.id)}
                  >
                    Confirm
                  </button>
                ) : null}
                {/* <button
                  className="btn btn-danger mx-2"
                  onClick={() => handleDelete(order.id)}
                >
                  Delete
                </button> */}
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
  );
};

export default AdminCheckOrder;
