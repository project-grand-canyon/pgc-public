import React from 'react';
import styles from './Logo.module.css';

import logoImage from '../../assets/images/logo.png'

const logo = (props) => {
    return (
        <div className={styles.Logo}>
            <img src={logoImage} alt="logo" />
        </div>
    );
};

export default logo;
