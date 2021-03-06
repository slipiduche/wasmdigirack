import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
// import 'tw-elements';
// redux store
import { Provider } from "react-redux";
import reduxThunk from "redux-thunk";
import reducers from "./store/reducers";
import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import reportWebVitals from './reportWebVitals';

const middleware = [reduxThunk];
const store = createStore(
  reducers,
  composeWithDevTools(applyMiddleware(...middleware))
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
