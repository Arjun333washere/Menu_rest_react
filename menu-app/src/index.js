import React from 'react';
import ReactDOM from 'react-dom/client'; // Updated import from 'react-dom' to 'react-dom/client'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap import
import AuthProvider from './provider/authProvider'; // Import AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

// Measure performance if needed
reportWebVitals();
