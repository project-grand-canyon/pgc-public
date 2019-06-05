import React from 'react';

import PitchSection from '../PitchSection/PitchSection';
import {Typography} from 'antd';

import styles from './TextPitchSection.module.css';

const textPitchSection = (props) => {
    return (
        <PitchSection {...props}>
            <div className={styles.TextPitchSection}>
                <Typography.Title level = {3}>{props.title}</Typography.Title>
                {props.children}
            </div>
        </PitchSection>
    );
};

export default textPitchSection;
