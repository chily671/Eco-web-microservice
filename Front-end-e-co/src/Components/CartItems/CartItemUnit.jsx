import React, {useContext} from 'react'
import "./CartItemUnit.css"
import { ShopContext } from '../../Context/ShopContext'

const CartItemUnit = ({props, quantity}) => {

  const {removeFromCart} = useContext(ShopContext);

  return (
    <div className="product-card">
      <img
        className="product-image"
        src={props.image}
        alt={props.name}
      />
      <div className="product-details">
        <h2 className="product-name">{props.name}</h2>
        <span className="price-des">
          <div className="description">
            <p className="product-category">{props.model}</p>
            <p className="product-color">{props.sex}</p>
          </div>
          <p className="product-price">${props.price}</p>
        </span>

        <div className="quantity-selector">
          <p className="product-size">Size {props.size}</p>
          <div>
            <span className="quantity-label">Quantity:</span>
            <button className="quantity-button decrease-button">-</button>
            <span className="quantity-value">{quantity}</span>
            <button className="quantity-button increase-button">+</button>
          </div>
        </div>
        <div className="fav-remove">
          <button className="add-to-favorites">Move to Favorites</button>
          <button onClick={()=>{removeFromCart(props.id)}} className="remove-button">Remove</button>
        </div>
      </div>
    </div>
  )
}

export default CartItemUnit