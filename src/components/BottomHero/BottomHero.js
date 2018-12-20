import React from 'react';
import Button from '@material-ui/core/Button';

import styles from './BottomHero.module.css';
import { Typography, Grid } from '@material-ui/core';

const bottomHero = (props) => {
    return (
        <Grid 
            container 
            spacing={24} 
            direction='row'
            justify='space-around'
            className={styles.BottomHero}>

            <Grid 
                item 
                xs={12} 
                sm={8} 
                md={8}
                lg={8}
                className={styles.Text}>
                <Typography color="inherit" variant="h5">Are you ready?</Typography>
                <Typography color="inherit" variant="subtitle1">Don't know who your Member of Congress is? Find out at <a href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noopener noreferrer">house.gov</a>, then sign up!</Typography>
            </Grid>

            <Grid 
                item 
                xs={12} 
                sm={4} 
                md={4}
                lg={4}>
                <Button component={props.actioned} variant="contained" color="default">Sign Up</Button>
            </Grid>
        </Grid>
    );
};

export default bottomHero;
