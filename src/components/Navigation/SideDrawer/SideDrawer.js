import React from 'react';

import Logo from '../../Logo/Logo';
import NavigationItems from '../NavigationItems/NavigationItems'
import Backdrop from '../../Backdrop/Backdrop';

import styles from './SideDrawer.module.css';

const sidedrawer = (props) => {
    
    const openState = props.show ? styles.Open : styles.Close;
    const attachedClasses = [styles.SideDrawer, openState].join(' ');
    return (
        <>
            <div className={attachedClasses}>
                <div className={styles.Logo}>
                    <Logo />
                </div>
                <nav>
                    <NavigationItems />
                </nav>
            </div>
            <Backdrop show={props.show} click={props.closed} />
        </>
    );
};

export default sidedrawer;
