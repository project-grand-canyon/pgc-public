import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// import CssBaseline from '@material-ui/core/CssBaseline';


import App from './containers/App/App';
import * as serviceWorker from './serviceWorker';

import './index.css';

const app = (
    <BrowserRouter>
        <>
            {/* <CssBaseline /> */}
            <App />
        </>
    </BrowserRouter>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
