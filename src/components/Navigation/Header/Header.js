import React from 'react';

import LogoTitle from '../../LogoTitle/LogoTitle';
import NavigationItems from '../NavigationItems/NavigationItems';
import DrawerToggle from '../DrawerToggle/DrawerToggle';

import styles from './Header.module.css';

const header = (props) => {
    return (
        <header className={styles.Header}>
            <LogoTitle />
            <nav className={styles.DesktopOnly}>
                <NavigationItems />
            </nav>
            <DrawerToggle openedSideDrawer={props.openedSideDrawer} />
        </header>
    );
};

export default header;