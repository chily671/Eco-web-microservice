import React, { useState, useEffect } from "react";
import "./AdminListProduct.css";
import cross_icon from "../Assets/cross_icon.png";
import edit_icon from "../Assets/edit.png";
import "../../Pages/CSS/AdminPage.css";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import { useContext } from "react";

const AdminListProduct = () => {
  const { all_product } = useContext(ShopContext);
  const remove_product = async (product_id) => {
    let responseData;
    await fetch("/product/removeproduct", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "auth-token": `${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: product_id }),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      alert(responseData.message);
      window.location.replace("/listproduct");
    } else {
      alert(responseData.message);
    }
  };

  return (
    <div className="admin">
      <div className="list-product">
        <h1>All Products List</h1>
        <div className="listproduct-allproduct">
          <hr />
          {all_product.map((product, index) => {
            return (
              <div
                key={index}
                className="listproduct-format-main listproduct-format"
              >
                <img
                  src={`${product.image}`}
                  alt=""
                  className="listproduct-product-icon"
                />
                <p>{product.name}</p>
                <p>${product.price}</p>
                <p>{product.brand}</p>
                <p>{product.model}</p>
                <p>{product.size}</p>
                <p>{product.sex}</p>
                <p>{product.year}</p>
                <img
                  onClick={() => {
                    remove_product(product.id);
                  }}
                  src={cross_icon}
                  alt=""
                  className="listproduct-remove-icon"
                />
                <Link to={`/updateproduct/${product.id}`}>
                  <img
                    src={edit_icon}
                    alt=""
                    className="listproduct-edit-icon"
                  />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminListProduct;
