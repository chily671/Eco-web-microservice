import { useEffect, useState } from "react";
import { FaPlus, FaList, FaShoppingCart, FaBars, FaTimes, FaEnvelope, FaSignInAlt, FaSignOutAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeButton, setActiveButton] = useState("products");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  
  const navItems = [
    {
      id: "addproduct",
      label: "Add Product",
      icon: <FaPlus />,
      badge: false
    },
    {
      id: "listproduct",
      label: "List Products",
      icon: <FaList />,
      badge: 3
    },
    {
      id: "order",
      label: "Check Orders",
      icon: <FaShoppingCart />,
      badge: 5
    },
    {
      id: "managechat",
      label: "Messages",
      icon: <FaEnvelope />,
      badge: 2
    }
  ];

  useEffect(() => {
    handleAuth();
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleButtonClick = (id) => {
    setActiveButton(id);
  };

  const handleAuth = () => {
    if (localStorage.getItem("auth-token")) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-semibold text-gray-800">Admin Dashboard</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
                <Link to={`/${item.id}`} key={item.id}>
               <button
                key={item.id}
                onClick={() => handleButtonClick(item.id)}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeButton === item.id
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
                aria-label={item.label}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
                {item.badge && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
              </Link>
            ))}
            <button
              onClick={handleAuth}
              className="flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 bg-green-600 text-white hover:bg-green-700"
              aria-label={isLoggedIn ? "Logout" : "Login"}
            >
              <span className="mr-2">
                {isLoggedIn ? <FaSignOutAlt onClick={() => {
                  localStorage.removeItem("auth-token");
                  window.location.replace("/");}} /> : <FaSignInAlt onClick={() => {<Link to="/profile/overview" />}} />}
              </span>
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  handleButtonClick(item.id);
                  toggleMenu();
                }}
                className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium ${
                  activeButton === item.id
                    ? "bg-indigo-600 text-white"
                    : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
                aria-label={item.label}
              >
                <span className="mr-2">{item.icon}</span>
                {item.label}
                {item.badge && (
                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
            <button
              onClick={() => {
                handleAuth();
                toggleMenu();
              }}
              className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium bg-green-600 text-white hover:bg-green-700"
              aria-label={isLoggedIn ? "Logout" : "Login"}
            >
              <span className="mr-2">
                {isLoggedIn ? 
                (<FaSignOutAlt onClick={() => {
                  localStorage.removeItem("auth-token");
                  window.location.replace("/");}} />) 
                : (<FaSignInAlt onClick={() => {<Link to="/profile/overview" />}} />)}
              </span>
              {isLoggedIn ? "Logout" : "Login"}
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;