// src/context/UserContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constans";
import PropTypes from "prop-types";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const token = localStorage.getItem(ACCESS_TOKEN);

  const fetchUser = async () => {
    if (!token) return;
    try {
      const res = await api.get("/api/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(res.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={[user, setUser, fetchUser]}>
      {children}
    </UserContext.Provider>
  );
};

UserProvider.propTypes = {
    children: PropTypes.node.isRequired,
  };

export const useUser = () => useContext(UserContext);
