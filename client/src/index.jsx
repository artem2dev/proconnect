import React from 'react';
import ReactDOM from 'react-dom/client';
import 'simplebar/dist/simplebar.min.css';
import App from './components/App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
