import React from 'react';

import PitchSection from '../PitchSection/PitchSection';

import styles from './TextPitchSection.module.css';

const textPitchSection = (props) => {
    return (
        <PitchSection {...props}>
            <div className={styles.TextPitchSection}>
                <h3>{props.title}</h3>
                {props.children}
            </div>
        </PitchSection>
    );
};

export default textPitchSection;
