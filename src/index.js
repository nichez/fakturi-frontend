import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import './index.css';
import App from './App';
import invoiceReducer from './store/reducers/invoiceReducer';
import articleReducer from './store/reducers/articleReducer';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  invoices: invoiceReducer,
  articles: articleReducer,
});

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(thunk))
);

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#222A45',
    },
    secondary: {
      main: '#7467ef',
    },
  },
  typography: {
    subtitle1: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
    },
  },
});

const app = (
  <Provider store={store}>
    <Router basename='/'>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </Router>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
