import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

import styles from './Hero.module.css';

// const hero = (props) => {
class Hero extends Component {
    render() {
        return (
            <div className={styles.Hero}>
                <h3>Citizens' Climate Lobby's</h3>
                <h1>Project Grand Canyon</h1>
                <h3>Make a Difference on Climate Change With a Phone Call</h3>      
                <hr />
                <Button component={this.props.clicked} variant="contained" color="seconday">Sign Up</Button>
            </div>
        );
    }
};

export default Hero;
