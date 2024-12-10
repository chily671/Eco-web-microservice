import React, { useContext, useEffect } from "react";
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";

const ProductDisplay = (props) => {
  const { product } = props;
  const { updateInteraction, addToCart } = useContext(ShopContext);
  console.log(product.image + "check check check");
  
  useEffect(() => {
    updateInteraction(product.id, "views");
  }, []);
  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div className="productdisplay-img-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <div className="productdisplay-img">
          <img className="productdisplay-main-img" src={product.image} alt="" />
        </div>
      </div>
      <div className="productdisplay-right">
        <h1>{product.name}</h1>
        <div className="productdisplay-right-stars">
          {product.rating > 0 ? (
            Array.from({ length: product.rating }).map((_, i) => (
              <img key={i} src={star_icon} alt="" />
            ))
          ) : (
            <img src={star_dull_icon} alt="" />
          )}

          <p>{product.rating}</p>
        </div>
        <div className="productdisplay-right-prices">
          <div className="productdisplay-right-price-old"></div>
          <div className="productdisplay-right-price-new">${product.price}</div>
        </div>
        <div className="productdisplay-right-description">
          nasjdvkjldnsvlkjnnlkvnsdlknvlknsdlkvnlkdsnvlksdnlvknsdlkvnlk
          vnskdnvlksdnvlkndslkvnlksdnvklsdnvlkdsnvkldnslkv
        </div>
        <div className="productdisplay-right-size">
          <h1>Select Size</h1>
          <div className="productdisplay-right-sizes">
            <div>S</div>
            <div>M</div>
            <div>L</div>
            <div>XL</div>
            <div>XXL</div>
          </div>
        </div>
        <button
          onClick={() => {
            addToCart(product.id);
            updateInteraction(product.id, "addToCart");
          }}
        >
          ADD TO CART
        </button>
        <p className="productdisplay-right-category">
          <span>Category :</span>Women, T-Shirt, Crop Top
        </p>
        <p className="productdisplay-right-category">
          <span>Tags :</span>Modern, Latest
        </p>
      </div>
    </div>
  );
};

export default ProductDisplay;
