import React, { useContext } from 'react'
import './CartItems.css'
import { ShopContext } from '../../Context/ShopContext'
import CartItemUnit from './CartItemUnit'

const CartItems = () => {
    // Chuyển hướng đến trang checkout
    const handleCheckout = () => {
        window.location.href = '/checkout';
    }

    const {getTotalCartAmount, all_product, cartItems} = useContext(ShopContext);
  return (
    <div className='cartitems'>
      <div className="cartitems-format-main">
      
      <div className="cartitems-left">
      <div className="title-cart">
        <h1>Your Cart</h1>
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

        <div className="cartitems-right">
        <div className="cartitems-total">
            <div>
              <div className="cartitems-total-item">
                <p>Subtatal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <p>Shipping</p>
                <p>Free</p>
              </div>
              <hr />
              <div className="cartitems-total-item">
                <h3>Total</h3>
                <h3>${getTotalCartAmount()}</h3>
              </div>
            </div>
            <button onClick={handleCheckout} >PROCEED TO CHECKOUT</button>
        </div>
        <div className="cartitems-promocode">
          <p>If you have a promo code, Enter it here</p>
          <div className="cartitems-promobox">
            <input type="text" placeholder="promo code" name="" id="" />
            <button>Submit</button>
          </div>
        </div>
      </div>
      </div>
      
      
    </div>
  )
}

export default CartItems
