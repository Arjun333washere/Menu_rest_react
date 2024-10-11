import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Ensure correct import for jwtDecode

// Create an Axios instance with a base URL for your Django backend
const createAxiosInstance = (refreshTokens) => {
    const axiosInstance = axios.create({
        baseURL: 'http://127.0.0.1:8000', // Django REST API base URL
    });

    // Request interceptor: Adds Authorization header to every request
    axiosInstance.interceptors.request.use(
        async (config) => {
            const accessToken = localStorage.getItem('access_token'); // Get accessToken from localStorage

            // If the accessToken is present, check if it is expired
            if (accessToken) {
                const tokenExpirationTime = jwtDecode(accessToken).exp * 1000; // Decode the token to get expiration time
                if (tokenExpirationTime < Date.now()) {
                    // Token expired, refresh it
                    console.log("Access token expired. Refreshing token...");
                    const newAccessToken = await refreshTokens(); // Call the passed refreshTokens function
                    if (newAccessToken) {
                        config.headers['Authorization'] = `Bearer ${newAccessToken}`; // Add new token to header
                    } else {
                        // Handle scenario where token refresh fails (optional)
                        console.error("Failed to refresh token. User might be logged out.");
                    }
                } else {
                    config.headers['Authorization'] = `Bearer ${accessToken}`; // Add valid access token to header
                }
            }

            return config; // Return the modified config
        },
        (error) => {
            console.error("Request error:", error);
            return Promise.reject(error);
        }
    );

    // Response interceptor: Handles token refresh on 401 errors
    axiosInstance.interceptors.response.use(
        (response) => response, // Return response if successful
        async (error) => {
            const originalRequest = error.config;

            // If request fails due to expired access token (401 error) and has not been retried yet
            if (error.response && error.response.status === 401 && !originalRequest._retry) {
                console.log("Unauthorized error. Attempting to refresh token...");
                originalRequest._retry = true; // Mark the request as retried
                const newAccessToken = await refreshTokens(); // Attempt to refresh the token

                // If refresh was successful, retry the original request with the new token
                if (newAccessToken) {
                    originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`; // Set new token in header
                    return axiosInstance(originalRequest); // Retry the original request
                } else {
                    // If refresh fails, handle logout or redirect
                    console.log("Refresh token failed. Logging out...");
                    // Call logout or similar function (you might want to implement this in your AuthContext)
                }
            }

            return Promise.reject(error); // Reject the error if it can't be handled
        }
    );

    return axiosInstance; // Return the configured Axios instance
};

export default createAxiosInstance;
