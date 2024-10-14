import React from "react";
import "./Search.css";
import ggvoice_icon from "../Assets/ggvoice.png";
import search_icon from "../Assets/pngwing.com (1).png";

const Search = () => {
  return (
    <div className="searchbar">
      <div className="searchbar-wrapper">
        <div className="searchbar-left">
          <div className="search-icon-wrapper">
            <span className="search-icon searchbar-icon">
              <img src={search_icon} alt="Google Search" />
            </span>
          </div>
        </div>

        <div className="searchbar-center">
          <div className="searchbar-input-spacer"></div>

          <input
            type="text"
            className="searchbar-input"
            placeholder="Search Google"
          />
        </div>

        <div className="searchbar-right">
          <div className="voice-search-btn" aria-label="Search by voice">
            <img src={ggvoice_icon} alt="Google Voice Search" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
