import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './i18n';  // import just created i18n initializer

// StyleX serves its CSS through a virtual module in dev; production extracts it.
if (import.meta.env.DEV) {
  void import('virtual:stylex:runtime');
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
