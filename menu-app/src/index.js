import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import './common.css'; // Import the common styles globally
import 'bootstrap/dist/css/bootstrap.min.css'; // Ensure Bootstrap is imported globally as well
import { AuthProvider } from './context/AuthContext'; // Only import AuthProvider here

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <AuthProvider>
            <App /> {/* Only App component here */}
        </AuthProvider>
    </React.StrictMode>
);

// Performance measuring
reportWebVitals();
