import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';

import Landing from '../Landing/Landing';
import SignUp from '../SignUp/SignUp';

import styles from './App.module.css';

class App extends Component {
  render() {
    return (
      <div className={styles.App}>
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/signup" component={SignUp} />
            <Route render={() => {return <h2>404</h2>}} />
          </Switch>
      </div>
    );
  }
}

export default App;
