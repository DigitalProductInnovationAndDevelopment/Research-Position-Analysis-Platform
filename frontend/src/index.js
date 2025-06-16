import React from 'react';
import ReactDOM from 'react-dom/client';
import './assets/styles/variables.css';
import './assets/styles/global.css';
import App from './App.jsx';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

