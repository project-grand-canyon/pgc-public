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
        state: null,
        district: null,
        communicationMethods: null,
        postCallerDetailsError: null
    }

    handleFormSubmit = (fieldsValues) => {
        const {congressionalDistrict} = {...fieldsValues};
        const state = congressionalDistrict[0];
        const district = congressionalDistrict[1];
        
        const caller = {
            districtId: fieldsValues.districtId,
            zipCode: fieldsValues.zipCode,
            firstName: fieldsValues.firstName,
            lastName: fieldsValues.lastName,
        }
        
        const communicationMethods = [];
        if (fieldsValues.phone) {
            communicationMethods.push('sms');
            caller['phone'] = fieldsValues.phone;
        }
        if (fieldsValues.email) {
            communicationMethods.push('email');
            caller['email'] = fieldsValues.email;
        }
        caller['contactMethods'] = communicationMethods;
        axios.post('callers', caller).then((response)=>{
            this.process_happy_signup(state, district, communicationMethods)
        }).catch((error)=>{            
            const errMessage = error.response.data.message;
            const isDupe = errMessage.includes('Duplicate entry');
            if (isDupe) {
                Modal.warning({
                    title: 'There was an error with your submission',
                    content: (
                        <div>
                          <p>The contact information you provided already exists in our database. This means you are already registered with Project Grand Canyon.<br/><br/>No action is required from you.</p>
                        </div>
                      )
                  });
            } else {
                Modal.error({
                    title: 'There was an error submitting the form',
                    content: (
                        <div>
                          <p>{`${errMessage}`}</p>
                        </div>
                      )
                  });
            }
        });
    }

    process_happy_signup = (state, district, communicationMethods) => {
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