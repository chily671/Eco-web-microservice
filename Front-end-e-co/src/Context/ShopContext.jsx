import React, { createContext, useState } from "react";
import { useEffect } from "react";

//ShopContext được tạo bằng createContext() và được export ra ngoài
//để có thể sử dụng ở bất kỳ đâu trong ứng dụng.
export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [all_product, setAll_Product] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [totalCartAmount, setTotalCartAmount] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const [User, setUser] = useState([]);

  useEffect(() => {
    fetch("/product/allproduct")
      .then((response) => response.json())
      .then((data) => setAll_Product(data));

    if (localStorage.getItem("auth-token")) {
      fetch("/user/cart", {
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => setCartItems(data))
        .then((data) => console.log(data));

      fetch("/user/user", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => setUser(data))
        .then((data) => console.log(data));
      console.log(User);

      fetch("/order/order", {
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => setOrderList(data))
        .then((data) => console.log(data));
    }
  }, []);

  useEffect(() => {
    if (cartItems.length === 0) {
      setTotalCartAmount(0);
    } else {
      setTotalCartAmount(getTotalCartAmount());
    }
  }, [cartItems]);

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: itemId in prev ? prev[itemId] + 1 : 1,
    }));
    if (localStorage.getItem("auth-token")) {
      fetch("/user/addtocart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .then((data) => console.log("product added to cart"));
    }
  };

  const increaseQuantity = () => {};

  const decreaseQuantity = () => {
    setCartItems((prev) => ({ ...prev, quantity: prev.quantity - 1 }));
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    if (localStorage.getItem("auth-token")) {
      fetch("/removefromcart", {
        method: "POST",
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: itemId }),
      })
        .then((response) => response.json())
        .then((data) => console.log(data));
    }
  };

  const getTotalCartAmount = () => {
    let totalAmout = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        let itemInfo = all_product.find((product) => product.id === item);
        if (itemInfo) {
          totalAmout += itemInfo.price * cartItems[item];
        }
      }
    }
    return totalAmout;
  };

  const getTotalCartItems = () => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  };

  const getTotalOrderItems = () => {
    let totalItem = 0;
    for (const item in orderList) {
      totalItem += 1;
    }
    return totalItem;
  };

  const contextValue = {
    getTotalCartItems,
    getTotalCartAmount,
    all_product,
    cartItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    totalCartAmount,
    orderList,
    getTotalOrderItems,
    User,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
