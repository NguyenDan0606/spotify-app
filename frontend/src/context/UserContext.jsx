import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import api from "../api";
import { ACCESS_TOKEN } from "../constans";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await api.get("/api/profile/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data);
      if (res.data?.avatar) {
        localStorage.setItem("avatar", res.data.avatar);
      }
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
