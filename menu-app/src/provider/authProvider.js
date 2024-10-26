import axios from "axios";
import { createContext, useContext, useEffect, useMemo, useState,useCallback } from "react";


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
  // const logout = useCallback(async () => {
  //   try {
  //     await axios.post("http://127.0.0.1:8000/auth/logout/");
  //     setToken_(null);
  //     // No navigation after logout
  //   } catch (error) {
  //     console.error("Error logging out:", error);
  //   }
  // }, []); // No need for navigate as a dependency anymore
  // Function to log out the user (clear token from context and localStorage)
  const logout = useCallback(async () => {
    try {
      // Get the refresh token from localStorage
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Check if refresh token exists before proceeding
      if (refreshToken) {
        // Send the refresh token in the request body
        await axios.post("http://127.0.0.1:8000/auth/logout/", {
          refresh: refreshToken,  // Send the refresh token in the request body
        });
  
        // Clear the access token and refresh token after successful logout
        setToken_(null);  // Clears the access token from state and localStorage
        localStorage.removeItem('refreshToken');  // Clear the refresh token from localStorage
        console.log("Successfully logged out");  // Optional: Add this to see if logout succeeds
      } else {
        console.warn("No refresh token found in localStorage.");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  }, []);  // No need for navigate as a dependency anymore
  
  

  // Memoized value for the context to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({ token, setToken, logout }), [token, logout]);

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
