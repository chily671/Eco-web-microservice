import React, { useContext } from "react";
import "./CartItemUnit.css";
import { ShopContext } from "../../Context/ShopContext";
import { FiMinus, FiPlus } from "react-icons/fi";

const CartItemUnit = ({ props }) => {
  const { removeFromCart, addToCart, decreaseQuantity, cartItems } =
    useContext(ShopContext);

  return (
    <div className="product-card">
      <img className="product-image" src={props.image} alt={props.name} />
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
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => decreaseQuantity(props.id)}
            >
              <FiMinus className="h-4 w-4" />
            </button>
            <span className="text-sm">{cartItems[props.id]}</span>
            <button
              className="p-1 hover:bg-gray-100 rounded"
              onClick={() => addToCart(props.id)}
            >
              <FiPlus className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="fav-remove">
          <button className="add-to-favorites">Move to Favorites</button>
          <button
            onClick={() => {
              removeFromCart(props.id);
            }}
            className="remove-button"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItemUnit;
