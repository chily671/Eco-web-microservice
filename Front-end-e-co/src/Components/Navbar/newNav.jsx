import React, { useState, useEffect } from "react";
import { FiSearch, FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";
import { ShopContext } from "../../Context/ShopContext";
import { AuthenticationContext } from "../../Context/AuthenticationContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const { getTotalCartItems } = useContext(ShopContext);
  const { isAdmin } = useContext(AuthenticationContext);

  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Luxury Watch Model X",
      price: 299.99,
      image: "images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3"
    },
    {
      id: 2,
      name: "Smart Watch Pro",
      price: 199.99,
      image: "images.unsplash.com/photo-1579586337278-3befd40fd17a?ixlib=rb-4.0.3"
    }
  ]);

  const dummySearchResults = [
    { id: 1, name: "Rolex Submariner" },
    { id: 2, name: "Omega Seamaster" },
    { id: 3, name: "TAG Heuer Carrera" }
  ];

  useEffect(() => {
    if (searchQuery.length > 0) {
      const filtered = dummySearchResults.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => total + item.price, 0).toFixed(2);
  };

  return (
    <nav className="bg-white shadow-lg fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-8 w-auto"
                src="images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3"
                alt="Watch Store Logo"
              />
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <a href="#" className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium">Home</a>
                <div className="relative group">
                  <button className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium">Shop</button>
                  <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 ease-in-out">
                    <div className="py-1">
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Men's Watches</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Women's Watches</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Luxury Watches</a>
                      <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Smartwatches</a>
                    </div>
                  </div>
                </div>
                <a href="#" className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium">About Us</a>
                <a href="#" className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium">Blog</a>
                <a href="#" className="text-gray-700 hover:text-black px-3 py-2 rounded-md text-sm font-medium">Contact</a>
              </div>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search watches..."
                  className="w-64 px-4 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {searchResults.length > 0 && (
                <div className="absolute mt-2 w-64 bg-white rounded-md shadow-lg">
                  {searchResults.map((result) => (
                    <div key={result.id} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      {result.name}
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
                  {cartItems.length}
                </span>
              </button>

              {cartOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg">
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-3">Shopping Cart</h3>
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 mb-3">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-12 w-12 object-cover rounded"
                        />
                        <div>
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">${item.price}</p>
                        </div>
                      </div>
                    ))}
                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between">
                        <span className="font-medium">Total:</span>
                        <span className="font-medium">${getTotalCartItems()}</span>
                      </div>
                      <button className="w-full mt-3 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
                        Checkout
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button className="text-gray-700 hover:text-black">
              <FiUser className="h-6 w-6" />
            </button>
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-700 hover:text-black"
              aria-label="Main menu"
            >
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50">Home</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50">Shop</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50">About Us</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50">Blog</a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-black hover:bg-gray-50">Contact</a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;