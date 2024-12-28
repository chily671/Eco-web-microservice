import React, { useState } from "react";
import { FaStar, FaStarHalf } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import { ShopContext } from "../../Context/ShopContext";
import { useContext } from "react";

const ProductDetail = (props) => {
  const { product } = props;
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const { updateInteraction, addToCart } = useContext(ShopContext);

  const renderStars = (product) => {
    const rating = 4.5;
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = 4.5 % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FaStar key={`star-${i}`} className="text-yellow-400 inline-block" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FaStarHalf key="half-star" className="text-yellow-400 inline-block" />
      );
    }

    const remainingStars = 5 - stars.length;
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <FaStar
          key={`empty-star-${i}`}
          className="text-gray-300 inline-block"
        />
      );
    }

    return stars;
  };

  return (
    <div className=" bg-gradient-to-br from-blue-50 to-purple-50 pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="md:flex">
          <div className="md:flex-shrink-0 md:w-1/2">
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
              onError={(e) => {
                e.target.src =
                  "https://images.unsplash.com/photo-1540821924489-7690c70c4eac";
              }}
            />
          </div>

          <div className="p-8 md:w-1/2">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-indigo-600">
                ${product.price}
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-center">
                <div
                  className="flex space-x-1"
                  aria-label={`Rating ${product.rating} out of 5 stars`}
                >
                  {renderStars(product.rating)}
                </div>
                <span className="ml-2 text-gray-600">(136 rating)</span>
              </div>
            </div>

            {/* Added Description Section */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description ||
                  "A symbol of timeless elegance and adventure, this 41mm masterpiece features a striking blue dial, robust stainless steel case, and versatile strap options. Powered by the in-house Caliber 5100, it delivers precision, a 60-hour power reserve, and unmatched sophistication for any occasion."}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Select Size</h3>
              <div className="flex space-x-4"></div>
            </div>

            <button
              onClick={() => {
                updateInteraction(product.id, "addToCart");
                addToCart(product.id);
              }}
              disabled={loading}
              className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold
                shadow-lg hover:bg-indigo-700 transform hover:-translate-y-0.5 transition-all
                focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              aria-label="Add to Cart"
            >
              {loading ? (
                <BiLoaderAlt className="animate-spin inline-block mr-2" />
              ) : (
                "Add to Cart"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
