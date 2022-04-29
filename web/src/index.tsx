import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import env from './env/env';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </React.StrictMode>
);

const recaptchaScript = document.createElement('script')
recaptchaScript.src = `https://www.google.com/recaptcha/api.js?render=${env.RECAPTCHA_V3_SITE_KEY}`
recaptchaScript.async = true
document.body.appendChild(recaptchaScript)
