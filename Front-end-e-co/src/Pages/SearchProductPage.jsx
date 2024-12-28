import React, { useContext, useEffect } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";
import dropdpwn_icon from "../Components/Assets/dropdown_icon.png";
import Item from "../Components/Item/Item";
import SearchBar from "../Components/SearchBar/SearchBar";
import FilterView from "../Components/Filter/Filter";
import { useState } from "react";
import "../Components/SearchBar/SearchBar.css";
import SearchProduct from "../Components/SearchProduct/SearchProduct";

const SearchProductPage = (props) => {
  return SearchProduct(props);
};

export default SearchProductPage;
