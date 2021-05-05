import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Modal, Typography } from 'antd';

import axios from '../../util/axios-api';
import ResponsiveLayout from '../Layout/ResponsiveLayout/ResponsiveLayout';
import SignUpForm from './SignUpForm/SignUpForm';

import styles from './SignUp.module.css';

class SignUp extends Component {

    state = {
        didSignUp: false,
        district: null,
        communicationMethods: null,
        postCallerDetailsError: null
    }

    handleFormSubmit = (fieldsValues) => {
        const { district, zipCode, firstName, lastName, phone, email } = fieldsValues
        const caller = {
            districtId: district.districtId,
            zipCode,
            firstName,
            lastName,
        }
        
        const communicationMethods = [];
        if (phone) {
            communicationMethods.push('sms');
            caller['phone'] = phone;
        }
        if (email) {
            communicationMethods.push('email');
            caller['email'] = email;
        }
        caller['contactMethods'] = communicationMethods;
        axios.post('callers', caller).then((response)=>{
            this.process_happy_signup(district, communicationMethods)
        }).catch((error)=>{
            const isDupe = errMessage.includes('Duplicate entry');
            if (isDupe) {
                Modal.warning({
                    title: 'There was an error with your submission',
                    content: (
                        <div>
                            <p>The contact information you provided already exists in our database. This means you are already registered with the Monthly Calling Campaign.<br/><br/>No action is required from you.</p>
                        </div>
                        )
                    });
                return;
            } else {
                if (error.response && error.response.data)
                {
                    const errMessage = error.response.data.message;
                    Modal.error({
                        title: 'There was an error submitting the form',
                        content: (
                            <div>
                                <p>{`${errMessage}`}</p>
                            </div>
                            )
                        }
                    );   
                } else {
                    Modal.error({
                        title: 'There was an error submitting the form',
                        content: (
                            <div>
                                <p>An unknown error occurred</p>
                            </div>
                            )
                        }
                    );  
                }
            }
        });
    }

    process_happy_signup = (district, communicationMethods) => {
        this.setState({
            district: district,
            communicationMethods: communicationMethods,
            didSignUp: true
        });
    }

    render() { 
        if (this.state.didSignUp) {
            const {state, number, status} = this.state.district;
            return <Redirect
                to={{
                pathname: "/signup/thankyou",
                search: `?state=${state}&district=${number}&com=${this.state.communicationMethods.join('-')}&status=${status}`
            }}
          />;
        }

        return (
            <ResponsiveLayout activeLinkKey="/signup">
                <div className={styles.SignUp}>
                    <Typography.Title level={2} className={styles.Title}>
                        Sign Up
                    </Typography.Title>
                    <Typography.Paragraph className={styles.Subtitle}>We’ll only reach out to you once a month to provide you with your call-in guide</Typography.Paragraph>
                    <SignUpForm onSuccessfulSubmit={this.handleFormSubmit} />
                </div>
            </ResponsiveLayout>
        )
    }
}

export default SignUp;
