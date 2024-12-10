import React, { useContext } from "react";
import Hero from "../Components/Hero/Hero";
import Popular from "../Components/Popular/Popular";
import Offers from "../Components/Offers/Offers";
import NewCollections from "../Components/NewCollections/NewCollections";
import NewsLetter from "../Components/NewsLetter/NewsLetter";
import Chat from "../Components/Chat/Chat";
import Recommend from "../Components/Recommend/Recommend";
import { AuthenticationContext } from "../Context/AuthenticationContext";
import { useRef } from "react";

const Shop = () => {
  const {isLoggedIn} = useContext(AuthenticationContext);
  const newCollectionsRef  = useRef(null);
  const handleScroll = () => {
    newCollectionsRef.current.scrollIntoView({ behavior: "smooth" });
  }
  return (
    <div>
      <Hero onScroll={handleScroll} />
      {(isLoggedIn)? <Recommend/> : <Popular />}
      
      <div ref={newCollectionsRef}>
        <NewCollections />
      </div>
      <NewsLetter />
      <Chat />
    </div>
  );
};

export default Shop;
