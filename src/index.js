import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

import './style/index.scss';

import store from './store';
import { Provider as ReduxProvider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';

import Root from './routes';

const App = () => (
  <React.StrictMode>
    <ReduxProvider store={store}>
      <Router>
        <Root />
      </Router>
    </ReduxProvider>
  </React.StrictMode>
);

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
