import React from 'react';
import ReactDOM from 'react-dom/client';
import {CookiesProvider} from "react-cookie";


import './App.css';
import App from './App.jsx';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <CookiesProvider>
        <App />
    </CookiesProvider>
    
);


