import React from 'react';

import PageTitle from '../PageTitle/PageTitle';
import Logo from '../Logo/Logo';

import styles from './LogoTitle.module.css';

const logotitle = (props) => {
    return (
        <div className={styles.LogoTitle}>
            <Logo />
            <PageTitle />
        </div>
    );
};

export default logotitle;
