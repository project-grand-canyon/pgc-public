import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga'
import { BrowserRouter } from 'react-router-dom';


import App from './containers/App/App';

import './index.css';

const app = (
    <BrowserRouter>
        <>
            <App />
        </>
    </BrowserRouter>
);

ReactGA.initialize('UA-140402020-1'); // Google Analytics
ReactDOM.render(app, document.getElementById('root'));
