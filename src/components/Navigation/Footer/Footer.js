import React from 'react';

import { Link } from 'react-router-dom';

import styles from './Footer.module.css';

const footer = (props) => {
    return (
        <footer className={styles.Footer}>
            <div className={styles.Links}>
                <span>
                    <Link to="/">Home</Link> | <Link to="/signup">Sign Up</Link>
                </span>
            </div>
            <div className={styles.ShoutOutCCL}>
                <span>
                    A project of <a href="http://www.cclusa.org" target="_blank" rel="noopener noreferrer">Citizens' Climate Lobby</a> volunteers.
                </span>
            </div>
        </footer>
    );
};

export default footer;
