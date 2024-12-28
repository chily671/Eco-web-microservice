import React from "react";

const NewCartItem = ({ props }) => {
    console.log("🚀 ~ NewCartItem ~ props:", props)
    
  return (
    <div className="flex items-center gap-3 mb-3">
      <img
        src={props.image}
        alt={props.name}
        className="h-12 w-12 object-cover rounded"
      />
      <div>
        <p className="text-sm font-medium">{props.name}</p>
        <p className="text-sm text-gray-500">${props.price}</p>
      </div>
    </div>
  );
};

export default NewCartItem;
