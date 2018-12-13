import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';

import Layout from '../Layout/Layout';
import Landing from '../Landing/Landing';
import SignUp from '../SignUp/SignUp';

import styles from './App.module.css';

class App extends Component {
  render() {
    return (
      <div className={styles.App}>
        <Layout>
          <h1>Project Grand Canyon Folks</h1>
          <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/signup" component={SignUp} />
            <Route render={() => {return <h2>404</h2>}} />
          </Switch>
        </Layout>
      </div>
    );
  }
}

export default App;
