// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext(); // named export

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  const login = (userData, authToken) => {
    let roleName = null;
    switch (userData.roleId) {
      case 1:
        roleName = "Admin";
        break;
      case 2:
        roleName = "PayrollProcessor";
        break;
      case 3:
        roleName = "Employee";
        break;
      case 4:
        roleName = "HR";
        break;
      default:
        roleName = "Unknown";
    }

    const newUser = { ...userData, role: roleName };
    setUser(newUser);
    setToken(authToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook
export const useAuth = () => useContext(AuthContext);
