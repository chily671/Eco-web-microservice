import React, { useState, useEffect } from "react";
import {
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaUser,
  FaLock,
  FaEnvelope,
} from "react-icons/fa";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const emailDomains = [
    "@gmail.com",
    "@yahoo.com",
    "@hotmail.com",
    "@outlook.com",
  ];

  const login = async () => {
    console.log("Login Function Excuted", formData);
    let responseData;
    await fetch("/user/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  const signup = async () => {
    console.log("signup Function Excuted", formData);
    let responseData;
    await fetch("/user/signup", {
      method: "POST",
      headers: {
        Accept: "application/form-data",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      window.location.replace("/");
    } else {
      alert(responseData.errors);
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "email" && !value.includes("@")) {
      setSuggestions(emailDomains.map((domain) => `${value}${domain}`));
    } else {
      setSuggestions([]);
    }

    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    if (name === "email") {
      if (!value) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(value)) {
        newErrors.email = "Invalid email format";
      } else {
        delete newErrors.email;
      }
    }

    if (name === "password") {
      if (!value) {
        newErrors.password = "Password is required";
      } else if (value.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      } else {
        delete newErrors.password;
      }
    }

    if (name === "confirmPassword") {
      if (!value) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (value !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match";
      } else {
        delete newErrors.confirmPassword;
      }
    }

    if (name === "username") {
      if (!value) {
        newErrors.name = "Name is required";
      } else if (value.length < 2) {
        newErrors.name = "Name must be at least 2 characters";
      } else {
        delete newErrors.name;
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setIsLoading(false);
      alert(isLogin ? "Login successful!" : "Registration successful!");
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData({ ...formData, email: suggestion });
    setSuggestions([]);
    validateField("email", suggestion);
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      username: "",
    });
    setErrors({});
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-[#232323] max-w-md w-full space-y-8  backdrop-blur-lg p-8 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-[1.02] border border-white/20">
        <div>
          <h2 className=" mt-6 text-center text-4xl font-extrabold text-white tracking-tight">
            {isLogin ? "Welcome Back" : "Join Us Today"}
          </h2>
          <p className="mt-2 text-center text-sm text-white/80">
            {isLogin
              ? "Sign in to continue your journey"
              : "Create an account to get started"}
          </p>
          <button
            onClick={toggleAuthMode}
            className="mt-4 w-full text-sm font-medium text-white hover:text-white/80 transition-colors duration-300 underline decoration-2 underline-offset-4"
          >
            {isLogin
              ? "Need an account? Sign up"
              : "Already have an account? Sign in"}
          </button>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md space-y-4">
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-white/60" />
                </div>
                <input
                  id="name"
                  name="username"
                  type="text"
                  autoComplete="name"
                  required
                  className={`appearance-none block ml w-full pl-10 px-3 py-3 border ${
                    errors.username ? "border-red-500" : "border-white/20"
                  } bg-white/5 text-white placeholder-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent sm:text-sm transition-all duration-300`}
                  placeholder="Full Name"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                {errors.username && (
                  <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                )}
              </div>
            )}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-white/60" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`appearance-none block w-full pl-10 px-3 py-3 border ${
                  errors.email ? "border-red-500" : "border-white/20"
                } bg-white/5 text-white placeholder-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent sm:text-sm transition-all duration-300`}
                placeholder="Email address"
                value={formData.email}
                onChange={handleInputChange}
              />
              {suggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl mt-1 overflow-hidden">
                  {suggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      className="px-4 py-2 hover:bg-white/20 cursor-pointer text-white text-sm transition-colors duration-150"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
              {errors.email && (
                <p className="mt-2 text-sm text-red-400">{errors.email}</p>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-white/60" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                className={`appearance-none block w-full pl-10 px-3 py-3 border ${
                  errors.password ? "border-red-500" : "border-white/20"
                } bg-white/5 text-white placeholder-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent sm:text-sm transition-all duration-300`}
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/60 hover:text-white/80"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <FaEyeSlash className="h-5 w-5" />
                ) : (
                  <FaEye className="h-5 w-5" />
                )}
              </button>
              {errors.password && (
                <p className="mt-2 text-sm text-red-400">{errors.password}</p>
              )}
            </div>
            {!isLogin && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-white/60" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  className={`appearance-none block w-full pl-10 px-3 py-3 border ${
                    errors.confirmPassword
                      ? "border-red-500"
                      : "border-white/20"
                  } bg-white/5 text-white placeholder-white/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent sm:text-sm transition-all duration-300`}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-400">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            )}
          </div>

          <div>
            <button
              type="submit"
              onClick={isLogin ? login : signup}
              disabled={isLoading || Object.keys(errors).length > 0}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-pink-500 disabled:hover:to-indigo-600"
            >
              {isLoading ? (
                <FaSpinner className="animate-spin h-5 w-5" />
              ) : (
                <span className="flex items-center">
                  {isLogin ? "Sign in" : "Create Account"}
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
