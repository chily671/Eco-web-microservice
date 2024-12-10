import React, { useContext, useRef, useState } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import user_icon from "../Assets/avatar.png";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";
import dropdown_icon from "../Assets/dropdown_icon.png";
import Search from "../Search/Search";
import { FaRegMessage } from "react-icons/fa6";
import { AuthenticationContext } from "../../Context/AuthenticationContext";

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartItems } = useContext(ShopContext);
  const { isAdmin } = useContext(AuthenticationContext);
  const menuRef = useRef();

  const dropdown_toggle = (e) => {
    menuRef.current.classList.toggle("nav-menu-visible");
    e.target.classList.toggle("open");
  };

  return (
    <div className="navbar">
    <Link to="/">
      <div className="nav-logo">
        <img src={logo} alt="" />
        <p>Watch Shop</p>
      </div>
      </Link>
      <img
        className="nav-dropdown"
        onClick={dropdown_toggle}
        src={dropdown_icon}
        alt=""
      />
      <ul ref={menuRef} className="nav-menu">
      <li
          onClick={() => {
            setMenu("home");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/">
            Home
          </Link>
          {menu === "home" ? <hr /> : <></>}
        </li>
        <li
          onClick={() => {
            setMenu("shop");
          }}
        >
          <Link style={{ textDecoration: "none" }} to="/shop">
            Shop
          </Link>
          {menu === "shop" ? <hr /> : <></>}
        </li>
        
      </ul>
      {/* <div className="nav-search">
        <Search />
      </div> */}
      <div className="nav-login-cart">
        {localStorage.getItem("auth-token") ? (
          <button
            onClick={() => {
              localStorage.removeItem("auth-token");
              window.location.replace("/");
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/loginup">
            <button>Login</button>
          </Link>
        )}

        <Link to="/cart">
          <img src={cart_icon} alt="" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
        {isAdmin ? (
          <Link to="/managechat">
            <FaRegMessage size={24} />
          </Link>
        ) : null}
        {localStorage.getItem("auth-token") ? (
          <Link to="/profile/overview">
            <img src={user_icon} alt="" className="user_icon" />
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default Navbar;
