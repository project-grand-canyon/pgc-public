import React from 'react';

import NavigationItem from './NavigationItem/NavigationItem';

import styles from './NavigationItems.module.css';

const navigationitems = (props) => {
    return (
        <ul className={styles.NavigationItems}>
            <NavigationItem link="/"> Home</NavigationItem>
            <NavigationItem link="/signup">Sign Up</NavigationItem>
        </ul>
    );
};

export default navigationitems;
