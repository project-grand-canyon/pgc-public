import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';

import CallIn from '../CallIn/CallIn'
import Landing from '../Landing/Landing';
import SignUp from '../SignUp/SignUp';
import SignUpThankYou from '../SignUp/ThankYou/ThankYou';
import CallThankYou from '../CallIn/ThankYou/ThankYou';
import ScrollToTop from '../ScrollToTop/ScrollToTop';

import styles from './App.module.css';

class App extends Component {
  render() {
    return (
      <ScrollToTop>
        <div className={styles.App}>
            <Switch>
              <Route path="/" exact component={Landing} />
              <Route path="/signup/thankyou" component={SignUpThankYou} />
              <Route path="/signup" component={SignUp} />
              <Route path="/call/thankyou" component={CallThankYou} />
              <Route path="/call" component={CallIn} />
              <Route render={() => {return <h2>404</h2>}} />
            </Switch>
        </div>
      </ScrollToTop>
    );
  }
}

export default App;
