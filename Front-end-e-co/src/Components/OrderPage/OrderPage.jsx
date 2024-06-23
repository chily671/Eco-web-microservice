import React, {useState, useEffect, useContext} from 'react'
import './OrderPage.css'
import { ShopContext } from '../../Context/ShopContext';
import { Button } from '@chatscope/chat-ui-kit-react';
import Modal from 'react-modal';

const OrderPage = () => {

    const customStyles = {
        content: {
          width: '50%', // Điều chỉnh chiều rộng của modal
          height: '50%', // Điều chỉnh chiều cao của modal
          top: '50%', // Dịch modal xuống dưới 50% của viewport
          left: '50%', // Dịch modal sang phải 50% của viewport
          transform: 'translate(-50%, -50%)', // Dịch modal để nó căn giữa
        },
      };

  const {orderList, all_product} = useContext(ShopContext);

  const [viewOrderProduct, setViewOrderProduct] = useState({'loong': 1});

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = (orderProducts) => {
    if (orderProducts) {
      setViewOrderProduct(orderProducts);
    }
    setModalOpen(true);
  };

  useEffect(() => {
    console.log("viewOrderProduct", viewOrderProduct);
  }, [viewOrderProduct]);

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
        <h2>Product List</h2>
        
            {all_product.map((product, i) => {       
              if (product.id in orders) {
                return <div key={i} className="listproduct-format-main listproduct-format">
                <img src={`${product.image}`} alt="" className="listproduct-product-icon" />
                <p>{product.name}</p>
                <p>${product.price}</p>
                <p>{orders[product.id]}</p>
              </div>
              }
              else {
                return null;
              }
            })}
        <button onClick={onRequestClose}>Close</button>
      </Modal>
    );
  }

  return (
    <div className='admin'>
      
    <div className='list-product'>
        <h1>
          All Orders List
        </h1>
        <div className="listproduct-allproduct">
          <hr />
          {orderList.map((order, index) => {
            return <div key={index} className="listproduct-format-main listproduct-format">
            <p>{order._id}</p>
            <p>{order.fullname}</p>
            <p>{order.time}</p>
            <p>{order.status}</p>
            <p>{order.total}</p>
            <Button onClick={()=>handleOpenModal(order.products)}>View</Button>
          </div>
          })}
        </div>
    </div>
    <ProductListModal
        orders={viewOrderProduct}
        isOpen={isModalOpen}
        onRequestClose={handleCloseModal}
      />
    </div>
  )
}

export default OrderPage