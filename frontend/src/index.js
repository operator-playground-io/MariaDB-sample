import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import dotenv from 'dotenv';

dotenv.config();
// console.log('Env: ', process.env);
console.log('Server: ', process.env.REACT_APP_SERVER_URL);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
