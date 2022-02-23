import * as Sentry from '@sentry/react';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import './index.css';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

Sentry.init({
  dsn: 'https://e5edc0b4010c46978ceab1fa81fc2e90@o432207.ingest.sentry.io/5728413',
  release: 'appjusto-admin@' + process.env.REACT_APP_VERSION,
  environment: process.env.REACT_APP_ENVIRONMENT,
  debug: process.env.REACT_APP_ENVIRONMENT !== 'live',
});

const refreshCacheAndReload = () => {
  if (caches) {
    console.log('Clearing old cache...');
    // Service worker cache should be cleared with caches.delete()
    caches.keys().then((names) => {
      for (const name of names) {
        caches.delete(name);
      }
    });
  }
  console.log('Reloading Admin...');
  // delete browser cache and hard reload
  window.location.reload();
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register({ onUpdate: refreshCacheAndReload });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
