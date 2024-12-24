import React, { useState, useEffect, useContext } from "react";
import { FaSearch, FaShoppingCart, FaStar, FaHeart } from "react-icons/fa";
import { ShopContext } from "../Context/ShopContext";
import NewItem from "../Components/Item/NewItem";

const ProductListPage = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 100000 });
  const [sortBy, setSortBy] = useState("newest");
  const [wishlist, setWishlist] = useState([]);
  const [viewProductIds, setViewProductIds] = useState([]);

  const { all_product, updateInteraction } = useContext(ShopContext);

  // Fetch all products initially
  useEffect(() => {
    setViewProductIds(all_product.map((product) => product.id));
  }, [all_product]);

  // Filter and sort products
  const filterAndSortProducts = () => {
    let filtered = all_product.filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        product.price >= priceRange.min &&
        product.price <= priceRange.max
    );

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        filtered.sort((a, b) => b.id - a.id);
    }

    setViewProductIds(filtered.map((product) => product.id));
  };

  useEffect(() => {
    filterAndSortProducts();
  }, [searchTerm, priceRange, sortBy, all_product]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handlePriceChange = (min, max) => {
    setPriceRange({ min, max });
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  // Lọc sản phẩm dựa trên `sex` và các tiêu chí khác
  const currentProducts = viewProductIds
    .map((productId) => all_product.find((product) => product.id === productId))
    .filter(
      (product) =>
        product &&
        (product.sex === "Women's watch")
    );

  return (
    <div className="container mx-auto px-4 pb-8 pt-[70px]">
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search products in Women's watch..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={handleSearch}
              aria-label="Search products"
            />
            <FaSearch className="absolute right-3 top-3 text-gray-400" />
          </div>
          <div className="flex gap-4">
            <select
              className="h-fit px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={handleSortChange}
              value={sortBy}
              aria-label="Sort products"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Rating</option>
            </select>
            <div className="flex gap-4">
              <label htmlFor="min-price">Min Price</label>
              <input
                type="number"
                id="min-price"
                className="px-2 py-1 mt-1 mb-[10px] border rounded-lg"
                onChange={(e) =>
                  handlePriceChange(e.target.value, priceRange.max)
                }
                value={priceRange.min}
              />
              <label htmlFor="max-price">Max Price</label>
              <input
                type="number"
                id="max-price"
                className="px-2 py-1 mt-1 mb-[10px] border rounded-lg"
                onChange={(e) =>
                  handlePriceChange(priceRange.min, e.target.value)
                }
                value={priceRange.max}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        {/* {currentProducts.map(
          (product) =>
            product && (
              <div
                key={product.id}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105 hover:shadow-xl"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                    loading="lazy"
                  />
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-4 right-4 p-2 rounded-full ${
                      wishlist.includes(product.id)
                        ? "bg-red-500 text-white"
                        : "bg-white text-gray-600"
                    }`}
                    aria-label={`Add ${product.name} to wishlist`}
                  >
                    <FaHeart />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-2">
                    {product.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold">${product.price}</span>
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                      aria-label={`Add ${product.name} to cart`}
                      onClick={() => updateInteraction(product.id, "cart")}
                    >
                      <FaShoppingCart />
                    </button>
                  </div>
                </div>
              </div>
            )
        )} */}

        {currentProducts.map((item, i) => {
          return (
            <NewItem
              onclick={() => updateInteraction(item.id, "views")}
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              price={item.price}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ProductListPage;
