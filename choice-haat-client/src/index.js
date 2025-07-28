// choice-haat-client/src/index.js

import './index.css'            // ← must come first
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter><App /></BrowserRouter>
);

