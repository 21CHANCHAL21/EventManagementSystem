// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component that wraps your app and provides the AuthContext value
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Mock function to simulate logging in
  const login = (user) => {
    setCurrentUser(user);
  };

  // Mock function to simulate logging out
  const logout = () => {
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
