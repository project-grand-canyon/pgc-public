import React, { Component } from 'react';

import ResponsiveLayout from '../Layout/ResponsiveLayout';
import SignUpForm from './SignUpForm/SignUpForm';

import styles from './SignUp.module.css';

class SignUp extends Component {

    render() {  
        return (
            <ResponsiveLayout activeLinkKey="/signup">
                <div className={styles.SignUp}>
                    <h2>
                        Sign Up
                    </h2>
                    <SignUpForm />
                </div>
            </ResponsiveLayout>
        )
    }
}

export default SignUp;
