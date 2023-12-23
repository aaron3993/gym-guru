import React, { createContext, useContext, useState, useEffect } from "react";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        setAuthenticated(true);
      } else {
        setUser(null);
        setAuthenticated(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      setAuthenticated(false);
      setUser(null);
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const value = {
    user,
    isAuthenticated,
    handleLogout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
