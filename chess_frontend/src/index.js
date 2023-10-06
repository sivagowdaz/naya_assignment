import React from 'react';
import { Provider } from 'react-redux';
import {store} from './app/store'
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from './App';

import {
  RouterProvider
} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={Router} />
    </Provider>
  </React.StrictMode>
);