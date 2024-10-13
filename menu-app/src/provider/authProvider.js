import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Create AuthContext
const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  // State to hold the authentication token, initialized from localStorage if present
  const [token, setToken_] = useState(() => localStorage.getItem("token") || null); // Ensure it's null if not found

  // Function to set the authentication token
  const setToken = (newToken) => {
    setToken_(newToken);
    if (newToken) {
        localStorage.setItem('token', newToken); // Set the token in localStorage
    } else {
        localStorage.removeItem('token'); // Remove it if token is null
    }
};


  // Sync token with axios and localStorage whenever it changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = "Bearer " + token;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common["Authorization"];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Function to log out the user (clear token from context and localStorage)
  const logout = () => {
    setToken_(null);
  };

  // Memoized value for the context to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ token, setToken, logout }), [token]);

  // Provide the context value to all child components
  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext in components
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthProvider;
