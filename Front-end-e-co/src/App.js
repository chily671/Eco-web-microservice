import { useContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminAddProduct from "./AdminComponents/AdminAddProduct/AdminAddProduct";
import AdminChatPage from "./AdminComponents/AdminChatPage/AdminChatPage";
import AdminCheckOrder from "./AdminComponents/AdminCheckOrder/AdminCheckProduct";
import Order from "./AdminComponents/AdminCheckOrder/Order";
import AdminListProduct from "./AdminComponents/AdminListProduct/AdminListProduct";
import AdminNavbar from "./AdminComponents/AdminNavbar/Navbar";
import "./App.css";
import CheckoutPage from "./Components/Checkout/CheckoutPage";
import NewFooter from "./Components/Footer/newFooter";
import NavBar from "./Components/Navbar/Navbar";
import Shopping from "./Pages/Shopping";
import Stripe from "./Components/StripePayMent/StripePayMent";
import { AuthenticationContext } from "./Context/AuthenticationContext";
import AdminChat from "./Pages/AdminChat";
import Cart from "./Pages/Cart";
import Checkouttest from "./Pages/Checkout";
import Login from "./Pages/Login";
import LoginSignup from "./Pages/LoginSignup";
import Product from "./Pages/Product";
import Shop from "./Pages/Shop";
import UserProfile from "./Pages/UserProfile";
import ShopCategory from "./Pages/ShopCategory";
function App() {
  const { isAdmin } = useContext(AuthenticationContext);
  return (
    <div>
      <BrowserRouter>
        {isAdmin ? <AdminNavbar /> : <NavBar />}
        <Routes>
          <Route path="/addproduct" element={<AdminAddProduct />} />
          <Route path="/listproduct" element={<AdminListProduct />} />
          <Route path="/adminchatpage" element={<AdminChatPage />} />
          <Route path="/admincheckorder" element={<AdminCheckOrder />} />
          <Route path="/order" element={<Order />} />
          <Route path="/" element={<Shop />} />
          <Route path="/shop/women" element={<Shopping />} />
          <Route path="/shop/men" element={<ShopCategory />} />
          <Route path="/products">
            <Route path=":productId" element={<Product />} />
          </Route>
          <Route path="/profile/:activepage" element={<UserProfile />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkouttest" element={<Checkouttest />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/loginup" element={<LoginSignup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/managechat" element={<AdminChat />} />
          <Route path="/success" element={<Stripe />} />
        </Routes>
        {/* {isAdmin ? null : <Footer />} */}
        {isAdmin ? null : <NewFooter />}
      </BrowserRouter>
    </div>
  );
}

export default App;
