import React from 'react';
import styles from './PitchSection.module.css';

const pitchsection = (props) => {
    const conditionalStylingClass = props.position % 2 === 0 ? styles.GreyBG : styles.WhiteBg;
    const styleClasses = [styles.PitchSection, conditionalStylingClass].join(' ');

    return (
        <div className={styleClasses}>
            {props.children}
        </div>
    );
};

export default pitchsection;
