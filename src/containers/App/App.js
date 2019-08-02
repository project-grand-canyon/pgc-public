import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';
import {Switch, Route} from 'react-router-dom';
import { withRouter } from "react-router";
import ReactGA from 'react-ga'

import CallIn from '../CallIn/CallIn'
import Landing from '../Landing/Landing';
import SignUp from '../SignUp/SignUp';
import SignUpThankYou from '../SignUp/ThankYou/ThankYou';
import CallThankYou from '../CallIn/ThankYou/ThankYou';
import ScrollToTop from '../ScrollToTop/ScrollToTop';

import styles from './App.module.css';

class App extends Component {

  constructor(props) {
    super(props);
    Sentry.init({
      dsn: "https://a5fc08e12a1744ddacc396ce79e034f2@sentry.io/1462422",
    });
    // Google Analytics
    ReactGA.initialize('UA-140402020-1', {
      testMode: process.env.NODE_ENV === 'test',
    });
  }

  componentDidMount() {
		ReactGA.pageview(window.location.pathname);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      if (this.props.location.pathname){
        ReactGA.pageview(this.props.location.pathname)
      }
    }
  }

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

export default withRouter(App);
export {App};
