import React, { useState, useEffect, useContext } from "react";
import {
  FiSearch,
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiMinus,
  FiPlus,
} from "react-icons/fi";
import { MdImageSearch } from "react-icons/md";
import { ShopContext } from "../../Context/ShopContext";
import { AuthenticationContext } from "../../Context/AuthenticationContext";
import { cn } from "../../lib/utils";
import { Link } from "react-router-dom";
import navlogo from "../Assets/image.png";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [viewProductIds, setViewProductIds] = useState([]);
  const [filterProducts, setFilterProducts] = useState([]);
  const {
    getTotalCartAmount,
    cartItems,
    getTotalCartItems,
    all_product,
    addToCart,
    decreaseQuantity,
    removeFromCart,
  } = useContext(ShopContext);
  const { isAdmin, isLoggedIn } = useContext(AuthenticationContext);
  const [isScrollingDown, setIsScrollingDown] = useState(false); // State để kiểm tra hướng scroll
  let lastScrollTop = 0; // Biến theo dõi vị trí scroll trước đó
  useEffect(() => {
    const handleScroll = () => {
      const currentScroll =
        window.pageYOffset || document.documentElement.scrollTop;

      if (currentScroll > lastScrollTop) {
        setIsScrollingDown(true); // Scroll xuống
      } else {
        setIsScrollingDown(false); // Scroll lên
      }

      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // Cập nhật vị trí scroll
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const searchHandler = (e) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (search === "") {
      setSearchResults([]);
    } else {
      setSearchResults(
        all_product.filter((val) =>
          val.name.toLowerCase().includes(search.toLowerCase())
        )
      );
    }
  }, [search]);

  useEffect(() => {
    loadData();
  }, [all_product]);

  const loadData = () => {
    setViewProductIds(all_product.map((val) => val.id));
  };

  const imageHandler = async (e) => {
    let formData = new FormData();

    console.log(e.target.files[0]);
    let file = e.target.files[0];
    if (file) {
      formData.append("query_img", file); // Đảm bảo rằng tên trường là chính xác
      console.log("File added to FormData:", file.name, file.size, file.type);
    } else {
      console.error("No file selected.");
      return; // Không gửi yêu cầu nếu không có file
    }

    let responsedata = await fetch("/product/imagesearch", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => setViewProductIds(data.scores));
  };

  return (
    <nav
      className={cn(
        " shadow-lg fixed w-full z-50 transition-all duration-300 ",
        isScrollingDown ? "" : "bg-neutral-800"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img className="h-16 w-auto" src={navlogo} />

            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <Link
                  to="/"
                  className="text-white hover:text-black px-3 py-2 rounded-md text-sm font-medium"
                >
                  Home
                </Link>
                <div className="relative group">
                  <button className="text-white hover:text-black px-3 py-2 rounded-md text-sm font-medium">
                    Shop
                  </button>
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in-out">
                    <div className="py-1">
                      <Link
                        to="/shop/men"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Men's Watches
                      </Link>

                      <Link
                        to="/shop/women"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Women's Watches
                      </Link>
                    </div>
                  </div>
                </div>
                <a
                  href="#"
                  className=" text-white hover:text-black px-3 py-2 rounded-md text-sm font-medium"
                >
                  About Us
                </a>
                <a
                  href="#"
                  className="text-white hover:text-black px-3 py-2 rounded-md text-sm font-medium"
                >
                  Blog
                </a>
                <a
                  href="#"
                  className="text-white hover:text-black px-3 py-2 rounded-md text-sm font-medium"
                >
                  Contact
                </a>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search watches..."
                  className="w-80 px-4 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={searchHandler}
                  value={search}
                />
                <label htmlFor="file-input">
                  <MdImageSearch className="cursor-pointer absolute right-8 top-[20px] transform -translate-y-1/2 text-gray-400" />
                </label>
                <input
                  onChange={imageHandler}
                  type="file"
                  name="image"
                  id="file-input"
                  hidden
                />
                <FiSearch className="absolute right-3 top-[20px] transform -translate-y-1/2 text-gray-400" />
              </div>
              {searchResults.length > 0 && (
                <div className="absolute mt-2 w-64 bg-white rounded-md shadow-lg">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <Link
                        to={`/products/${result.id}`}
                        onClick={() => {
                          setSearch("");
                          setSearchResults([]);
                        }}
                      >
                        {result.name}
                      </Link>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="flex items-center text-gray-700 hover:text-black"
                aria-label="Shopping cart"
              >
                <FiShoppingCart className="h-6 w-6" />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                  {getTotalCartItems()}
                </span>
              </button>

              {cartOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-md shadow-lg">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-3">
                      Shopping Cart
                    </h3>
                    <div className="max-h-64 overflow-y-auto">
                      {all_product.map((item) => {
                        console.log("🚀 ~ {all_product.map ~ item:", item);
                        if (item.id in cartItems) {
                          return (
                            <div
                              key={item.id}
                              className="flex items-center gap-3 mb-3"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-12 w-12 object-cover rounded"
                              />
                              <div>
                                <p className="text-sm font-medium">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  ${item.price}
                                </p>
                              </div>
                              <div className="flex space-x-2 mt-2 items-end">
                                <button
                                  className="p-1 hover:bg-gray-100 rounded"
                                  onClick={() => decreaseQuantity(item.id)}
                                >
                                  <FiMinus className="h-4 w-4" />
                                </button>
                                <span className="text-sm">
                                  {cartItems[item.id]}
                                </span>
                                <button
                                  className="p-1 hover:bg-gray-100 rounded"
                                  onClick={() => addToCart(item.id)}
                                >
                                  <FiPlus className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          );
                        }
                        return null; // Đảm bảo luôn trả về một giá trị, nếu không có điều kiện nào được thỏa mãn
                      })}
                    </div>

                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Total:</span>
                        <span className="font-medium">
                          ${getTotalCartAmount()}
                        </span>
                      </div>
                      <Link
                        to="/checkout"
                        onClick={() => {
                          setCartOpen(false);
                        }}
                      >
                        <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                          Checkout
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {isLoggedIn ? (
              <>
                <Link to="/profile/overview">
                  <button className="text-gray-700 hover:text-black">
                    <FiUser className="h-6 w-6" />
                  </button>
                </Link>

                <button
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => {
                    localStorage.removeItem("auth-token");
                    window.location.replace("/");
                  }}
                >
                  <FiUser className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <Link to="/login">
                <button className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gray-700 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <FiUser className="h-5 w-5" />
                  <span>Sign In</span>
                </button>
              </Link>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-black"
              aria-label="Main menu"
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50">
                Home
              </div>
            </Link>
            <Link
              to="/shop/men"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Men's Watches
            </Link>

            <Link
              to="/shop/women"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              Women's Watches
            </Link>
            <Link to="/">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50">
                About Us
              </div>
            </Link>
            <Link to="/">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50">
                Blog
              </div>
            </Link>
            <Link to="/">
              <div className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50">
                Contact
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
