import React, { useState, useContext, useEffect } from "react";
import "./CheckoutPage.css";
import VietnamData from "./ProvinceList";
import { ShopContext } from "../../Context/ShopContext";
import CartItemUnit from "../CartItems/CartItemUnit";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
const serverURL = "http://localhost:5009";

const CheckoutPage = () => {
  function Message({ content }) {
    return <p>{content}</p>;
  }
  const { all_product, cartItems, totalCartAmount, getTotalCartAmount } =
    useContext(ShopContext);

  const provinceList = Object.keys(VietnamData);

  const [province, setProvince] = useState("");
  const [cities, setCities] = useState([]);
  const [wards, setWards] = useState([]);
  const initialOptions = {
    "client-id":
      "AYQ_XBnAGfXPBw43yGEDl_XJJqENJXsKPcSbM6lyVqowKMLlhQFei5XP1zUdnug5YwXxA-NZ9lvzZT42",
    "enable-funding": "card",
    "disable-funding": "paylater,venmo",
    "data-sdk-integration-source": "integrationbuilder_sc",
  };

  const [message, setMessage] = useState("");

  // Tạo các biến để lưu thông tin đơn hàng

  const [orderDetail, setOrderDetail] = useState({
    total: totalCartAmount,
    fullname: "",
    email: "",
    phone: "",
    address: "",
    province: "",
    city: "",
    ward: "",
    time: new Date().toLocaleString(),
    products: cartItems,
  });

  const changHandler = (e) => {
    setOrderDetail({ ...orderDetail, [e.target.name]: e.target.value });
    if (e.target.name === "province") {
      setProvince(e.target.value);
      setCities(Object.keys(VietnamData[e.target.value]));
    }
    if (e.target.name === "city") {
      setWards(VietnamData[province][e.target.value]);
    }
  };

  const OrderSuccess = () => {
    alert("Order successfully");
    window.location.replace("/");
  };

  useEffect(() => {
    setOrderDetail({ ...orderDetail, total: totalCartAmount });
  }, [totalCartAmount]);

  useEffect(() => {
    setOrderDetail({ ...orderDetail, products: cartItems });
  }, [cartItems]);

  useEffect(() => {
    console.log(orderDetail);
  }, [orderDetail]);

  const AddOrder = async () => {
    // Alert if no product in cart
    if (Object.keys(cartItems).length === 0) {
      alert("No product in cart");
      return;
    }

    let order = orderDetail;
    // check if all fields are filled
    for (let key in order) {
      if (order[key] === "") {
        alert("Please fill all fields");
        return;
      }
    }

    setOrderDetail({ ...orderDetail, total: totalCartAmount });

    await fetch("order/order", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "auth-token": `${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(order),
    })
      .then((response) => response.json())
      .then((data) => {
        data.success ? OrderSuccess() : alert(data.message);
      })
      .catch((err) => console.log(err));
    // Clear cart after order
    await fetch("user/cart", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "auth-token": `${localStorage.getItem("auth-token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((err) => console.log(err));
  };

  return (
    <div className="checkout">
      <div className="add-product">
        <div className="addproduct-itemfield">
          <p>Full name</p>
          <input
            value={orderDetail.fullname}
            onChange={changHandler}
            type="text"
            name="fullname"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Email</p>
          <input
            value={orderDetail.email}
            onChange={changHandler}
            type="text"
            name="email"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Phone Number</p>
          <input
            value={orderDetail.phone}
            onChange={changHandler}
            type="text"
            name="phone"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Address</p>
          <input
            value={orderDetail.address}
            onChange={changHandler}
            type="text"
            name="address"
            placeholder="Type here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>Province</p>
          <select
            value={orderDetail.province}
            onChange={changHandler}
            name="province"
            className="addproduct-selector"
          >
            {provinceList.map((province, index) => {
              return (
                <option key={index} value={province}>
                  {province}
                </option>
              );
            })}
          </select>
        </div>
        <div className="addproduct-itemfield">
          <p>City</p>
          <select
            value={orderDetail.city}
            onChange={changHandler}
            name="city"
            className="addproduct-selector"
          >
            {cities.map((city, index) => {
              return (
                <option key={index} value={city}>
                  {city}
                </option>
              );
            })}
          </select>
        </div>
        <div className="addproduct-itemfield">
          <p>Ward</p>
          <select
            value={orderDetail.ward}
            onChange={changHandler}
            name="ward"
            className="addproduct-selector"
          >
            {wards.map((ward, index) => {
              return (
                <option key={index} value={ward}>
                  {ward}
                </option>
              );
            })}
          </select>
        </div>
        <div className="total-amount">
          <p>Total Amount: {getTotalCartAmount()}</p>
        </div>
        <button
          onClick={() => {
            AddOrder();
          }}
          className="addproduct-btn"
        >
          Complete Order
        </button>
        <PayPalScriptProvider options={initialOptions}>
          <PayPalButtons
            style={{
              shape: "rect",
              layout: "vertical",
            }}
            createOrder={async () => {
              try {
                let ordercurrent = orderDetail;
                console.log("order", ordercurrent);
                const response = await fetch(`${serverURL}/api/orders`, {
                  method: "POST",
                  mode: "cors",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  // use the "body" param to optionally pass additional order information
                  // like product ids and quantities
                  body: ordercurrent,
                });

                const orderData = await response.json();

                if (orderData.id) {
                  return orderData.id;
                } else {
                  const errorDetail = orderData?.details?.[0];
                  const errorMessage = errorDetail
                    ? `${errorDetail.issue} ${errorDetail.description} (${orderData.debug_id})`
                    : JSON.stringify(orderData);

                  throw new Error(errorMessage);
                }
              } catch (error) {
                console.error(error);
                setMessage(`Could not initiate PayPal Checkout...${error}`);
              }
            }}
            onApprove={async (data, actions) => {
              try {
                const response = await fetch(
                  `${serverURL}/api/orders/${data.orderID}/capture`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                );

                const orderData = await response.json();
                // Three cases to handle:
                //   (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                //   (2) Other non-recoverable errors -> Show a failure message
                //   (3) Successful transaction -> Show confirmation or thank you message

                const errorDetail = orderData?.details?.[0];

                if (errorDetail?.issue === "INSTRUMENT_DECLINED") {
                  // (1) Recoverable INSTRUMENT_DECLINED -> call actions.restart()
                  // recoverable state, per https://developer.paypal.com/docs/checkout/standard/customize/handle-funding-failures/
                  return actions.restart();
                } else if (errorDetail) {
                  // (2) Other non-recoverable errors -> Show a failure message
                  throw new Error(
                    `${errorDetail.description} (${orderData.debug_id})`
                  );
                } else {
                  // (3) Successful transaction -> Show confirmation or thank you message
                  // Or go to another URL:  actions.redirect('thank_you.html');
                  const transaction =
                    orderData.purchase_units[0].payments.captures[0];
                  setMessage(
                    `Transaction ${transaction.status}: ${transaction.id}. See console for all available details`
                  );
                  console.log(
                    "Capture result",
                    orderData,
                    JSON.stringify(orderData, null, 2)
                  );
                }
              } catch (error) {
                console.error(error);
                setMessage(
                  `Sorry, your transaction could not be processed...${error}`
                );
              }
            }}
          />
        </PayPalScriptProvider>
        <Message content={message} />
      </div>
      <div className="Items-cart">
        {all_product.map((e, index) => {
          if (e.id in cartItems) {
            return (
              <CartItemUnit key={index} props={e} quantity={cartItems[e.id]} />
            );
          } else return null;
        })}
      </div>
    </div>
  );
};

export default CheckoutPage;
