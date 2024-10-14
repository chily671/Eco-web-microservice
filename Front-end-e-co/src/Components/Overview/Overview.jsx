import React from "react";
import "./Overview.css";

const Overview = (props) => {
  const { User } = props;
  return (
    <div className="accountsettings">
      <h1 className="mainhead1"> Personal Information</h1>

      <div className="form">
        <div className="form-group">
          <label htmlFor="name">Your Name: </label>
          <p>{User.username}</p>
        </div>

        <div className="form-group">
          <label htmlFor="phone">Your Phone: </label>
          <p>123456</p>
        </div>

        <div className="form-group">
          <label htmlFor="email">Your Email: </label>
          <p>{User.email}</p>
        </div>
      </div>
    </div>
  );
};

export default Overview;
