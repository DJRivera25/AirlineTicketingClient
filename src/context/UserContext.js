// src/context/UserContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState({
    id: null,
    isAdmin: null,
    fullName: "",
    email: "",
    mobileNo: "",
  });

  const unsetUser = () => {
    setUser({
      id: null,
      isAdmin: null,
      fullName: "",
      email: "",
      mobileNo: "",
    });
    localStorage.clear();
  };

  const fetchUser = async (authToken) => {
    if (!authToken) return unsetUser();

    try {
      const res = await axios.get("http://localhost:4000/users/details", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      setUser({
        id: res.data._id,
        isAdmin: res.data.isAdmin,
        fullName: res.data.fullName,
        email: res.data.email,
        mobileNo: res.data.mobileNo || "",
      });
    } catch (error) {
      console.error("Failed to fetch user:", error);
      unsetUser();
      setToken(null);
      localStorage.removeItem("token");
    }
  };

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      fetchUser(token);
    } else {
      localStorage.removeItem("token");
      unsetUser();
    }
  }, [token]);

  return (
    <UserContext.Provider value={{ user, setUser, unsetUser, token, setToken, fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
