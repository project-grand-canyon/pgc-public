import React from 'react';
import Button from '@material-ui/core/Button';

import styles from './Hero.module.css';
import { Typography } from '@material-ui/core';

const hero = (props) => {
    return (
        <div className={styles.Hero}>
            <Typography gutterBottom color="inherit" variant="h5">Citizens' Climate Lobby's</Typography>
            <Typography gutterBottom color="inherit" variant="h2">Project Grand Canyon</Typography>
            <Typography gutterBottom color="inherit" variant="h5">Make a Difference on Climate Change With a Phone Call</Typography>
            <hr />
            <Button component={props.actioned} variant="contained" color="default">Sign Up</Button>
        </div>
    );
};

export default hero;
