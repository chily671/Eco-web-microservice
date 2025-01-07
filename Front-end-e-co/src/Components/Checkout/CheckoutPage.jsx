import React, { useState, useContext, useEffect } from "react";
import VietnamData from "./ProvinceList";
import { ShopContext } from "../../Context/ShopContext";
import CartItemUnit from "../CartItems/CartItemUnit";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { loadStripe } from "@stripe/stripe-js";
import { FaUser, FaMapMarkerAlt, FaPhone, FaEnvelope } from "react-icons/fa";
import "./Checkout.css";

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
  const payserver = process.env.REACT_APP_PAY_URL;
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
    const { name, value } = e.target;
    if (name === "phone" && !/^\d+$/.test(value)) {
      alert("Vui lòng nhập số điện thoại hợp lệ.");
      return;
    }
    if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      alert("Vui lòng nhập email hợp lệ.");
      return;
    }
    if (name === "province") {
      setProvince(value);
      setCities(Object.keys(VietnamData[value]));
      setWards([]); // Reset ward khi đổi province
      setOrderDetail({ ...orderDetail, province: value, city: "", ward: "" });
    } else if (name === "city") {
      setWards(VietnamData[province][value]);
      setOrderDetail({ ...orderDetail, city: value, ward: "" });
    } else {
      setOrderDetail({ ...orderDetail, [name]: value });
    }
  };

  const OrderSuccess = () => {
    alert("Order successfully");
    window.location.replace("/");
  };

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

  const makeStripePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51QFV1OJu8ujkgWdNvelfz6p2KW3aP9zkLEe27fCuzvtfoWjUscrHK1RJOn52NZC8fQxl8zo1ZNZXiJUhF67umCl800HyCc5ZVl"
    );
    const body = {
      order: orderDetail,
    };
    console.log(body);

    const headers = {
      "Content-Type": "application/json",
      "auth-token": `${localStorage.getItem("auth-token")}`,
    };

    const session = await fetch(`/pay/create-checkout-session`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    }).then((response) => response.json());

    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });
    if (result.error) {
      console.log(result.error);
    } else {
      console.log("success");
      AddOrder();
    }
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

  return (
    <div>
      <div className="flex flex-grow  bg-gray-100 py-14 pl-14">
        <div className="min-h-screen w-1/2 bg-gray-100 py-12 sm:px-6 lg:px-8">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-8">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                Checkout Form
              </h2>

              <form className="space-y-6">
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FaUser className="mr-2" />
                    Fullname
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={orderDetail.fullname}
                    onChange={changHandler}
                    placeholder="Enter your username"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  {/* ${errors.username ? 'border-red-500' : 'border-gray-300'}  */}
                  {/* {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
              )} */}
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FaPhone className="mr-2" />
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={orderDetail.phone}
                    onChange={changHandler}
                    placeholder="Enter your phone number"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                </div>

                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FaEnvelope className="mr-2" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={orderDetail.email}
                    onChange={changHandler}
                    placeholder="Enter your email address"
                    className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                </div>
                <div>
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FaMapMarkerAlt className="mr-2" />
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={orderDetail.address}
                    onChange={changHandler}
                    placeholder="Enter your address"
                    className={`mt-1 block w-full px-3 py-2 border  rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  />
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FaMapMarkerAlt className="mr-2" />
                    Province
                  </label>
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
                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FaMapMarkerAlt className="mr-2" />
                    City
                  </label>
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

                  <label className="flex items-center text-sm font-medium text-gray-700">
                    <FaMapMarkerAlt className="mr-2" />
                    Ward
                  </label>
                  <select
                    value={orderDetail.ward}
                    onChange={changHandler}
                    name="ward"
                    className="addproduct-selector "
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
                  className="mt-5 w-full h-10 rounded-md bg-blue-600 cursor-pointer hover:bg-blue-700 text-white font-medium"
                >
                  Complete Order
                </button>

                <button
                  onClick={() => makeStripePayment()}
                  className="stripe-btn"
                >
                  Pay with Stripe
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
                        const response = await fetch(
                          `${payserver}/api/orders`,
                          {
                            method: "POST",
                            mode: "cors",
                            headers: {
                              "Content-Type": "application/json",
                            },
                            // use the "body" param to optionally pass additional order information
                            // like product ids and quantities
                            body: JSON.stringify(ordercurrent),
                          }
                        );

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
                        setMessage(
                          `Could not initiate PayPal Checkout...${error}`
                        );
                      }
                    }}
                    onApprove={async (data, actions) => {
                      try {
                        const response = await fetch(
                          `${payserver}/api/orders/${data.orderID}/capture`,
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
                          AddOrder();
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
              </form>
            </div>
          </div>
        </div>
        {/* <div className="flex flex-col gap-2 items-center w-1/2 p-4 bg-white rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800">
            Personal Information
          </h3>
          <hr className="my-2 " />
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
            
          </div>
          
          <Message content={message} />
        </div> */}
        <div className="flex-1 py-12 px-4 ">
          <div className="flex flex-row w-full h-full justify-center  bg-white rounded-lg shadow-lg py-12 px-4 sm:px-6 lg:px-8">
            <div className=" flex flex-col items-center">
              <h3 className="text-xl font-semibold text-gray-800">Cart Item</h3>
              <hr className="my-2 " />
              {all_product.map((e, index) => {
                if (e.id in cartItems) {
                  return <CartItemUnit key={index} props={e} />;
                } else return null;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
