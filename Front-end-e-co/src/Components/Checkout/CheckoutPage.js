import React, {useState, useContext, useEffect} from 'react'
import './CheckoutPage.css';
import VietnamData from './ProvinceList';
import { ShopContext } from '../../Context/ShopContext';
import CartItemUnit from '../CartItems/CartItemUnit';


const CheckoutPage = () => {

    const {all_product, cartItems, totalCartAmount} = useContext(ShopContext);

    const provinceList = Object.keys(VietnamData);

    const [province, setProvince] = useState('');
    const [cities, setCities] = useState([]);
    const [wards, setWards] = useState([]);

    // Tạo các biến để lưu thông tin đơn hàng
 
    const [orderDetail, setOrderDetail] = useState({
        fullname: '',
        email: '',
        phone: '',
        address: '',
        province: '',
        city: '',
        ward: '',
        time: new Date().toLocaleString(),
        total: totalCartAmount,
        products: cartItems,
    });

    const changHandler = (e) => { 
        setOrderDetail({...orderDetail, [e.target.name]: e.target.value});
        if(e.target.name === 'province'){
            setProvince(e.target.value);
            setCities(Object.keys(VietnamData[e.target.value]));
        }
        if(e.target.name === 'city'){
            setWards(VietnamData[province][e.target.value]);
        }
    }

    const OrderSuccess = () => {
        alert('Order successfully'); 
        window.location.replace('/');
    }

    useEffect(() => {
        setOrderDetail({...orderDetail, total: totalCartAmount});
    }, [totalCartAmount])

    useEffect(() => {
        setOrderDetail({...orderDetail, products: cartItems});
    }, [cartItems])

    useEffect(() => {
        console.log(orderDetail);
    }, [orderDetail])

    const AddOrder = async () => {
        // Alert if no product in cart
        if(Object.keys(cartItems).length === 1){
            alert('No product in cart');
            return;
        }

        let order = orderDetail;

        // check if all fields are filled
        for (let key in order){
            if(order[key] === ''){
                alert('Please fill all fields');
                return;
            }
        }

        setOrderDetail({...orderDetail, total: totalCartAmount});

        await fetch('order/order', {
            method: 'POST',
            headers:{
                Accept:'application/form-data',
                'auth-token':`${localStorage.getItem('auth-token')}`,
                'Content-Type':'application/json',
            },
            body: JSON.stringify(order)
        }).then((response) => response.json()).then((data) => {
            data.success?OrderSuccess():alert(data.message)
        }).catch((err) => console.log(err));
        // Clear cart after order
        await fetch('user/cart', {
            method: 'POST',
            headers:{
                Accept:'application/form-data',
                'auth-token':`${localStorage.getItem('auth-token')}`,
                'Content-Type':'application/json',
            },
            body: JSON.stringify({})
        }).then((response) => response.json()).then((data) => console.log(data)).catch((err) => console.log(err));

    }

    
    
  return (
    <div className='checkout'>
     
    <div className='add-product'>
        <div className="addproduct-itemfield">
            <p>Full name</p>
            <input value={orderDetail.fullname} onChange={changHandler} type="text" name='fullname' placeholder='Type here'/>
        </div>
        <div className="addproduct-itemfield">
            <p>Email</p>
            <input value={orderDetail.email} onChange={changHandler} type="text" name='email' placeholder='Type here'/>
        </div>
        <div className="addproduct-itemfield">
            <p>Phone Number</p>
            <input value={orderDetail.phone} onChange={changHandler} type="text" name='phone' placeholder='Type here'/>
        </div>
        <div className="addproduct-itemfield">
            <p>Address</p>
            <input value={orderDetail.address} onChange={changHandler} type="text" name='address' placeholder='Type here'/>
        </div>
        <div className="addproduct-itemfield">
            <p>Province</p>
            <select value={orderDetail.province} onChange={changHandler} name='province' className='addproduct-selector'>
                {
                    provinceList.map((province, index) => {
                        return <option key={index} value={province}>{province}</option>
                    })
                }
            </select>
        </div>
        <div className="addproduct-itemfield">
            <p>City</p>
            <select value={orderDetail.city} onChange={changHandler} name='city' className='addproduct-selector'>
                {
                    cities.map((city, index) => {
                        return <option key={index} value={city}>{city}</option>
                    })
                }
            </select>
        </div>
        <div className="addproduct-itemfield">
            <p>Ward</p>
            <select value={orderDetail.ward} onChange={changHandler} name='ward' className='addproduct-selector'>
                {
                    wards.map((ward, index) => {
                        return <option key={index} value={ward}>{ward}</option>
                    })
                }
            </select>
        </div>
        <button onClick={()=>{AddOrder()}} className="addproduct-btn">Complete Order</button>
    </div>
    <div className="Items-cart">
      {all_product.map((e, index)=>{
        if(e.id in cartItems)
        {
            return <CartItemUnit key={index} props={e} quantity={cartItems[e.id]}/> 
        }
        else
        return null;
      })}
      </div>
    

    </div>
  )
}

export default CheckoutPage