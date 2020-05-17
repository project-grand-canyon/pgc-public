import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux'
import { store } from './redux/store'

import "typeface-ubuntu";

import App from './containers/App/App';

import './index.css';

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <>
                <App />
            </>
        </BrowserRouter>
    </Provider>
);

ReactGA.initialize('UA-140402020-1'); // Google Analytics
ReactDOM.render(app, document.getElementById('root'));
