import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga'
import { BrowserRouter } from 'react-router-dom';
// import CssBaseline from '@material-ui/core/CssBaseline';


import App from './containers/App/App';

import './index.css';

const app = (
    <BrowserRouter>
        <>
            {/* <CssBaseline /> */}
            <App />
        </>
    </BrowserRouter>
);

ReactGA.initialize('UA-140402020-1'); // Google Analytics
ReactDOM.render(app, document.getElementById('root'));
