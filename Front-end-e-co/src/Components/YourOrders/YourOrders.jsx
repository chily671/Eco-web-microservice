import React, {useState, useEffect, useContext} from 'react'
import './YourOrders.css'
import { ShopContext } from '../../Context/ShopContext';
import { Button } from '@chatscope/chat-ui-kit-react';
import Modal from 'react-modal';

const YourOrders = () => {
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

  const [viewOrderProduct, setViewOrderProduct] = useState({products: {}});

  const [isModalOpen, setModalOpen] = useState(false);

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
            <p>Fullname:  {orders.fullname}</p>
            <p>Time:  {orders.time}</p>
            <p>Total:  {orders.total}</p>
            <p>Status:  {orders.status}</p>
        <table className='modal-table'>
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
                                <td><img src={`${product.image}`}/></td>
                                <td>{product.name}</td>
                                <td>${product.price}</td>
                                <td className='quantity-column'>{orders.products[product.id]}</td>
                            </tr>
                        )
                      }
                      else {
                        return null;
                      }
                    })}
                </tbody>
            </table>
      </Modal>
    );
  }
    return (
        <div className='yourorders'>
            <h1 className='mainhead1'>Your Orders</h1>

            <table>
                <thead>
                    <tr>
                        <th>Order id</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {orderList.map((item, index) => {
                        return (
                            <tr key={index}>
                                <td>{item._id}</td>
                                <td>{item.time}</td>
                                <td>
                                    <p>
                                        {item.status == 'Delivered' && <span className='greendot'></span>}
                                        {item.status == 'Pending' && <span className='yellowdot'></span>}
                                        {item.status == 'Cancelled' && <span className='reddot'></span>}
                                        {item.status}
                                    </p>
                                </td>
                                <td>${item.total}</td>
                                <td>
                                    <Button onClick={()=>handleOpenModal(item)} className='mainbutton1'>View</Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <ProductListModal
            orders={viewOrderProduct}
            isOpen={isModalOpen}
            onRequestClose={handleCloseModal}
            />
        </div>
    )
}

  export default YourOrders