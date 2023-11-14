import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './i18n';  // import just created i18n initializer

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
