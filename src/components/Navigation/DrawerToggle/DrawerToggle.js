import React from 'react';
import styles from './DrawerToggle.module.css';

const drawertoggle = (props) => {
    return (
        <div onClick={props.openedSideDrawer} className={styles.DrawerToggle}>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
};

export default drawertoggle;
