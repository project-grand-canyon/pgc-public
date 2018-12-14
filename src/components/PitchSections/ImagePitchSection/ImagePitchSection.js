import React from 'react';
import { Divider, Grid, Button } from '@material-ui/core';

import PitchSection from '../PitchSection/PitchSection';

import styles from './ImagePitchSection.module.css';

const imagepitchsection = (props) => {
    const imageSection = (
        <Grid 
            item
            xs={12} 
            sm={6} 
            md={4} 
            lg={4}
            className={styles.ImageSection}
            style={{ flexDirection: props.position % 2 ? 'row' : 'row-reverse' }}>
            <div className={styles.ImageContainer}>
                <img src={props.location} alt={props.alt} />
            </div>
        </Grid>
    );

    const textSection = (
        <Grid 
            item 
            xs={12} 
            sm={6} 
            md={8}
            lg={8} 
            className={styles.TextSection}>
            <h3>{props.title}</h3>
            <Divider variant='fullWidth'/>
            {props.children}
            <div className={styles.CTAWrapper}>
                <Button 
                    component={props.actioned} 
                    variant="contained" 
                    color="default">
                    Sign Up
                </Button>
            </div>
        </Grid>
    );

    return (
        <PitchSection {...props}>
            <Grid 
                container 
                spacing={24} 
                justify='space-between'
                direction= {props.position % 2 ? 'row' : 'row-reverse'}
                alignContent= 'space-between'
                className={styles.ImagePitchSection}>
                {imageSection}
                {textSection}
            </Grid>
        </PitchSection>
    );
};

export default imagepitchsection;
