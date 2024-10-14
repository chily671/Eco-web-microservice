import React, { createContext, useState, useEffect } from "react";

export const AuthenticationContext = createContext(null);

const AuthenticationContextProvider = (props) => {
  const [authToken, setAuthToken] = useState(
    localStorage.getItem("auth-token")
  );
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      await fetch("/user/isadmin", {
        method: "GET",
        headers: {
          "auth-token": authToken,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.isAdmin) {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
          }
        });
    }
    if (authToken) {
      setIsLoggedIn(true);
      checkAdmin();
    } else {
      setIsLoggedIn(false);
    }
  }, [authToken]);

  return (
    <AuthenticationContext.Provider
      value={{
        authToken,
        setAuthToken,
        isAdmin,
        setIsAdmin,
        reload,
        setReload,
        isLoggedIn,
        setIsLoggedIn,
      }}
    >
      {props.children}
    </AuthenticationContext.Provider>
  );
};

export default AuthenticationContextProvider;
