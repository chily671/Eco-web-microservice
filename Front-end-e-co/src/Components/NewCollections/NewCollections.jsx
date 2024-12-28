import React from "react";
import Item from "../Item/Item";
import NewItem from "../Item/NewItem";
import "./NewCollections.css";
import { useState } from "react";
import { useEffect, useContext } from "react";
import { ShopContext } from "../../Context/ShopContext";
const NewCollections = () => {
  const { updateInteraction } = useContext(ShopContext);
  const [new_collection, setNew_collection] = useState([]);

  useEffect(() => {
    fetch("/product/newcollection")
      .then((response) => response.json())
      .then((data) => setNew_collection(data));
  }, []);
  return (
    <div className="new-collections ">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item, i) => {
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

export default NewCollections;
