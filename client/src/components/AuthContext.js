import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("http://localhost:9000/check-auth", {
        credentials: "include", // to send cookies
      });
      if (response.ok) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth check error:", error);
    }
  };

  const login = async (username, password) => {
    try {
      const response = await fetch("http://localhost:9000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // to send cookies
      });
      if (response.ok) {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await fetch("http://localhost:9000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });
      if (response.ok) {
        // Optionally log the user in immediately after registration
        login(username, password);
      }
    } catch (error) {
      console.error("Register error:", error);
    }
  };

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:9000/logout", {
        method: "POST",
        credentials: "include", // to send cookies
      });
      if (response.ok) {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
