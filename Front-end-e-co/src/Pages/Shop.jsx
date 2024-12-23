import React, { useContext, useRef } from "react";
import Chat from "../Components/Chat/Chat";
import New_hero from "../Components/Hero/new-hero";
import NewCollections from "../Components/NewCollections/NewCollections";
import { AuthenticationContext } from "../Context/AuthenticationContext";

const Shop = () => {
  const { isLoggedIn } = useContext(AuthenticationContext);
  const newCollectionsRef = useRef(null);
  const handleScroll = () => {
    newCollectionsRef.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div>
      {/* <Hero onScroll={handleScroll} /> */}
      <New_hero />
      {/* {isLoggedIn ? <Recommend /> : <Popular />} */}

      <div ref={newCollectionsRef} className="mt-20">
        <NewCollections />
      </div>
      <Chat />
    </div>
  );
};

export default Shop;
