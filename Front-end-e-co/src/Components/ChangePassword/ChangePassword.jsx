import React, { useState } from "react";
import "./ChangePassword.css";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldpassword: "",
    newpassword: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const changePassword = async () => {
    console.log("changePassword Function Excuted", formData);
    let responseData;
    await fetch("/changepassword", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
        "auth-token": `${localStorage.getItem("auth-token")}`,
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      alert(responseData.message);
      window.location.replace("/profile/overview");
    } else {
      alert(responseData.message);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Personal Information
        </h2>
        <button
          className="w-32 mt-3 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => {
            changePassword();
          }}
        >
          Change Password
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col">
          <label
            htmlFor="oldpass"
            className="text-sm font-medium text-gray-600"
          >
            Old Password
          </label>
          <input
            name="username"
            onChange={changeHandler}
            type="text"
            id="oldpass"
            className="border-none outline-none rounded-full p-4 bg-gray-200 shadow-inner transition-transform duration-300 focus:bg-white focus:scale-105 focus:shadow-[13px_13px_100px_#969696,-13px_-13px_100px_#ffffff]"
          ></input>
        </div>

        <div className="flex flex-col">
          <label
            htmlFor="newpass"
            className="text-sm font-medium text-gray-600"
          >
            New Password
          </label>
          <input
            name="newpassword"
            onChange={changeHandler}
            type="email"
            id="newpass"
            className="border-none outline-none rounded-full p-4 bg-gray-200 shadow-inner transition-transform duration-300 focus:bg-white focus:scale-105 focus:shadow-[13px_13px_100px_#969696,-13px_-13px_100px_#ffffff]"
          ></input>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
