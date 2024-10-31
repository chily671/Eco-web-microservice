import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import LoginSignup from "./Pages/LoginSignup";
import Shop from "./Pages/Shop";
import Cart from "./Pages/Cart";
import Footer from "./Components/Footer/Footer";
import men_banner from "./Components/Assets/banner_mens.png";
import women_banner from "./Components/Assets/banner_women.png";
import kids_banner from "./Components/Assets/banner_kids.png";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import UserProfile from "./Pages/UserProfile";
import CheckoutPage from "./Components/Checkout/CheckoutPage";
import AdminAddProduct from "./AdminComponents/AdminAddProduct/AdminAddProduct";
import AdminListProduct from "./AdminComponents/AdminListProduct/AdminListProduct";
import AdminChatPage from "./AdminComponents/AdminChatPage/AdminChatPage";
import AdminCheckOrder from "./AdminComponents/AdminCheckOrder/AdminCheckProduct";
import ChatPage from "./AdminComponents/AdminChatPage/ManageChat";
import AdminChat from "./Pages/AdminChat";
import Checkouttest from "./Pages/Checkout";
import { useContext } from "react";
import Stripe from "./Components/StripePayMent/StripePayMent";
import { AuthenticationContext } from "./Context/AuthenticationContext";
import SearchProductPage from "./Pages/SearchProductPage";
function App() {
  const { isAdmin } = useContext(AuthenticationContext);
  return (
    <div>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/addproduct" element={<AdminAddProduct />} />
          <Route path="/listproduct" element={<AdminListProduct />} />
          <Route path="/adminchatpage" element={<AdminChatPage />} />
          <Route path="/admincheckorder" element={<AdminCheckOrder />} />
          <Route path="/" element={<Shop />} />
          <Route
            path="/mens"
            element={<ShopCategory banner={men_banner} category="men" />}
          />
          <Route
            path="/womens"
            element={
              <SearchProductPage banner={women_banner} category="women" />
            }
          />
          <Route
            path="/kids"
            element={<ShopCategory banner={kids_banner} category="kid" />}
          />
          <Route path="/products">
            <Route path=":productId" element={<Product />} />
          </Route>
          <Route path="/profile/:activepage" element={<UserProfile />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkouttest" element={<Checkouttest />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/managechat" element={<AdminChat />} />
          <Route path="/success" element={<Stripe />} />
          
        </Routes>
        {isAdmin ? null : <Footer />}
      </BrowserRouter>
    </div>
  );
}

export default App;
