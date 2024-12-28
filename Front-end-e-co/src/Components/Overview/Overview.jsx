import React, { useState } from "react";
import { FiEdit } from "react-icons/fi";
import "./Overview.css";

const Overview = (props) => {
  const { User } = props;

  const [formData, setFormData] = useState({
    username: User.username,
    email: User.email,
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const SetChange = async () => {
    // Check email format
    const emailFormat = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailFormat.test(formData.email)) {
      alert("Invalid Email Format");
      return;
    }

    console.log("signup Function Excuted", formData);
    let responseData;
    await fetch("/user/editinfo", {
      method: "PUT",
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
      alert(responseData.errors);
    }
  };
  return (
    <div>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
          <button
            className="w-32 mt-3 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            onClick={() => {
              SetChange();
            }}
          >
            Save Changes
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-600"
            >
              Name
            </label>
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              id="name"
              className="border-none outline-none rounded-full p-4 bg-gray-200 shadow-inner transition-transform duration-300 focus:bg-white focus:scale-105 focus:shadow-[13px_13px_100px_#969696,-13px_-13px_100px_#ffffff]"
            ></input>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-600"
            >
              Email
            </label>
            <input
              name="email"
              value={formData.email}
              onChange={changeHandler}
              type="email"
              id="email"
              className="border-none outline-none rounded-full p-4 bg-gray-200 shadow-inner transition-transform duration-300 focus:bg-white focus:scale-105 focus:shadow-[13px_13px_100px_#969696,-13px_-13px_100px_#ffffff]"
            ></input>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">Phone</label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-800">
                {User.phone || "No phone number"}{" "}
              </p>
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600">
              Default Address
            </label>
            <div className="mt-1 p-3 bg-gray-50 rounded-lg">
              <p className="text-gray-800">{User.address || "No address"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
