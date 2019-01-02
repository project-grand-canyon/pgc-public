import React from 'react';
import { Col, Divider, Row } from 'antd';

import PitchSection from '../PitchSection/PitchSection';

import styles from './ImagePitchSection.module.css';

const imagePitchSection = (props) => {
    const imageSection = (
        <Col 
            xs={24} 
            sm={12} 
            md={8} 
            lg={8}
            order={props.position % 2 ? 2 : 1}
            className={styles.ImageSection}
            style={{ flexDirection: props.position % 2 ? 'row' : 'row-reverse' }}>
            <div className={styles.ImageContainer}>
                <img src={props.location} alt={props.alt} />
            </div>
        </Col>
    );

    const textSection = (
        <Col 
            xs={24} 
            sm={12} 
            md={16}
            lg={16} 
            order={props.position % 2 ? 1 : 2}
            className={styles.TextSection}>
            <h3>{props.title}</h3>
            <Divider/>
            {props.children}
            <div className={styles.CTAWrapper}>
                {/* <Button 
                    component={props.actioned} 
                    variant="contained" 
                    color="default">
                    Sign Up
                </Button> */}
            </div>
        </Col>
    );

    return (
        <PitchSection {...props}>
            <Row 
                gutter={24} 
                justify="space-between"
                type="flex"
                className={styles.ImagePitchSection}>
                {imageSection}
                {textSection}
            </Row>
        </PitchSection>
    );
};

export default imagePitchSection;
