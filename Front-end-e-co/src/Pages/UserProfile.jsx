import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import SingleBanner from "../Components/Banners/Banner";
import banner_img from "../Components/Assets/jeremy-budiman-unsplash.jpg";
import "./CSS/UserProfile.css";
import UserSidebar from "../Components/UserSidebar/UserSidebar";
import AccountSetting from "../Components/AccountSetting/AccountSetting";
import ChangePassword from "../Components/ChangePassword/ChangePassword";
import YourOrders from "../Components/YourOrders/YourOrders";
import UserAddress from "../Components/UserAddress/UserAddress";
import LegalNotice from "../Components/LegalNotice/LegalNotice";
import Overview from "../Components/Overview/Overview";
import { ShopContext } from "../Context/ShopContext";
const UserProfile = () => {
  const { activepage } = useParams();
  const { User } = useContext(ShopContext);
  return (
    <div className="User-container">
      <SingleBanner heading="My Profile" bannerimage={banner_img} />
      <div className="userprofilein">
        <div className="userprofile-left">
          <UserSidebar activepage={activepage} />
        </div>
        <div className="userprofile-right ">
          {activepage === "overview" && <Overview User={User} />}
          {activepage === "changepassword" && <ChangePassword />}
          {activepage === "yourorders" && <YourOrders />}
          {activepage === "address" && <UserAddress User={User} />}
          {activepage === "legalnotice" && <LegalNotice />}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
