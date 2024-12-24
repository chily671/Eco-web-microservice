import React, { useContext, useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar, FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";

const NewItem = (props) => {
  const { addToCart } = useContext(ShopContext);
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const RatingStars = ({ rating }) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }

    return <div className="flex">{stars}</div>;
  };
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:scale-105">
      <div className="relative pb-[100%]">
        <Link to={`/products/${props.id}`}>
          <img
            src={props.image}
            alt={props.name}
            className="absolute top-0 left-0 w-full h-full object-cover"
            onError={(e) => {
              e.target.src =
                "https://images.unsplash.com/photo-1560393464-5c69a73c5770";
            }}
          />
        </Link>
        <button
          onClick={() => toggleWishlist(props.id)}
          className={`absolute top-4 right-4 p-2 rounded-full ${
            wishlist.includes(props.id)
              ? "bg-red-500 text-white"
              : "bg-white text-gray-600"
          }`}
          aria-label={`Add ${props.name} to wishlist`}
        >
          <FaHeart />
        </button>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {props.name}
        </h3>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xl font-bold text-gray-600">
            ${props.price.toFixed(2)}
          </span>
          <RatingStars rating={props.rating} />
        </div>
        <button
          className="w-full bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
          onClick={() => addToCart(props.id)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default NewItem;
