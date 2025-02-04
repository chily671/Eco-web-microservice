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
  const [recommend, setRecommend] = useState([]);
  const [interaction, setInteraction] = useState({});

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

      fetch("/product/recommended", {
        headers: {
          Accept: "application/form-data",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => setRecommend(data))
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

  const updateInteraction = (itemId, interaction) => {
    setInteraction(interaction);
    // Nếu người dùng đã đăng nhập, gửi thông tin lên backend
    if (localStorage.getItem("auth-token")) {
      fetch("/user/updateInteraction", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": `${localStorage.getItem("auth-token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId: itemId,
          action: interaction,
        }),
      })
        .then((response) => response.json())
        .then((data) => console.log("Interaction updated:", data))
        .catch((error) => console.error("Error updating interaction:", error));
    } else {
      console.log("User is not authenticated.");
    }
  };

  const decreaseQuantity = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: itemId in prev ? prev[itemId] - 1 : 1,
    }));
    if (localStorage.getItem("auth-token")) {
      fetch("/user/decrease", {
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

  // Remove item from cart
  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      let updatedCart = { ...prev };
      delete updatedCart[itemId];
      return updatedCart;
    });
    if (localStorage.getItem("auth-token")) {
      fetch("/user/removefromcart", {
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
        .then((data) => console.log("product removed from cart"));
    }
  };

  // Tính tổng tiền của giỏ hàng
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
    setTotalCartAmount(totalAmout);
    return totalAmout;
  };

  // Tính tổng số lượng sản phẩm trong giỏ hàng
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
    updateInteraction,
    interaction,
    decreaseQuantity,
    totalCartAmount,
    orderList,
    getTotalOrderItems,
    User,
    recommend,
    addToCart,
    removeFromCart,
  };
  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
