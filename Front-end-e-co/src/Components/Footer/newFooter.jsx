import React, { useState } from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Newsletter signup:", email);
    setEmail("");
  };

  return (
    <footer className=" bg-neutral-800 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Us Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">About Us</h3>
            <p className="text-gray-300">
              We are passionate about delivering quality products and exceptional shopping experiences to our valued customers worldwide.
            </p>
            <button className="text-blue-400 hover:text-blue-300 transition duration-300">
              Learn More →
            </button>
          </div>

          {/* Customer Service Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Customer Service</h3>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-300 hover:text-white transition duration-300">
                  Contact Us
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition duration-300">
                  Returns & Exchanges
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition duration-300">
                  Shipping Information
                </button>
              </li>
              <li>
                <button className="text-gray-300 hover:text-white transition duration-300">
                  FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Connect With Us</h3>
            <div className="flex space-x-4">
              <button
                aria-label="Facebook"
                className="text-gray-300 hover:text-white transition duration-300"
              >
                <FaFacebook className="text-2xl" />
              </button>
              <button
                aria-label="Twitter"
                className="text-gray-300 hover:text-white transition duration-300"
              >
                <FaTwitter className="text-2xl" />
              </button>
              <button
                aria-label="Instagram"
                className="text-gray-300 hover:text-white transition duration-300"
              >
                <FaInstagram className="text-2xl" />
              </button>
              <button
                aria-label="LinkedIn"
                className="text-gray-300 hover:text-white transition duration-300"
              >
                <FaLinkedin className="text-2xl" />
              </button>
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Newsletter</h3>
            <p className="text-gray-300">
              Subscribe to receive updates about new products and special offers.
            </p>
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Your Shop Name. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;