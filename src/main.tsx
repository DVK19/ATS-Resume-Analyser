import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';

import App from './App';
import './index.css';

import { ThemeProvider } from './context/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);