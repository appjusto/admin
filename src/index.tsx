import * as Sentry from '@sentry/react';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './app/App';
import './index.css';
import reportWebVitals from './reportWebVitals';

Sentry.init({
  dsn: 'https://e5edc0b4010c46978ceab1fa81fc2e90@o432207.ingest.sentry.io/5728413',
  release: 'my-project-name@' + process.env.npm_package_version,
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
