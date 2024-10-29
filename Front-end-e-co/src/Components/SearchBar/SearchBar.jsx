import React, { useState } from "react";
import "./SearchBar.css";
import data_product from "../Assets/all_product";
import iconsearch from "../Assets/pngwing.com (1).png";

function SearchBar({ placeholder, data }) {
  return (
    <div className="search">
      <div className="searchInputs">
        <input type="text" placeholder="Search for watches" />
        <button className="search-button">
          <img src={iconsearch} alt="Search" />
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
