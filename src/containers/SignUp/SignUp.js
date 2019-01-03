import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import ResponsiveLayout from '../Layout/ResponsiveLayout';
import SignUpForm from './SignUpForm/SignUpForm';

import styles from './SignUp.module.css';

class SignUp extends Component {

    state = {
        didSignUp: false,
        state: null,
        district: null,
        communicationMethods: null
    }

    handleFormSubmit = (fieldsValues) => {
        console.log('hi');
        console.log(fieldsValues);
        const {congressionalDistrict} = {...fieldsValues};
        const state = congressionalDistrict[0];
        const district = congressionalDistrict[1];
        const usesSms = fieldsValues.phone !== undefined;
        const usesEmail = fieldsValues.email !== undefined;
        const communicationMethods = [];
        if (usesSms) {
            communicationMethods.push('sms');
        }
        if (usesEmail) {
            communicationMethods.push('email');
        }
        this.setState({
            state: state,
            district: district,
            communicationMethods: communicationMethods,
            didSignUp: true
        });
    }

    render() { 
        
        if (this.state.didSignUp) {
            return <Redirect
                to={{
                pathname: "/signup/thankyou",
                search: `?state=${this.state.state}&district=${this.state.district}&com=${this.state.communicationMethods.join('-')}`
            }}
          />;
        }

        return (
            <ResponsiveLayout activeLinkKey="/signup">
                <div className={styles.SignUp}>
                    <h2>
                        Sign Up
                    </h2>
                    <SignUpForm onSuccessfulSubmit={this.handleFormSubmit} />
                </div>
            </ResponsiveLayout>
        )
    }
}

export default SignUp;
