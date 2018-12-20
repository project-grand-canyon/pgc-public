import React, { Component } from 'react';
import { Button, FormControl, FormGroup, Grid, Input, InputLabel, MenuItem, Paper, Select, Typography } from '@material-ui/core';

import formValidation from '../../util/validation/formValidation';

import styles from './SignUp.module.css';

class SignUp extends Component {

    state={
        formInputs: {
            firstName: {
                value: null,
                touched: false,
                error: null
            },
            lastName: {
                value: null,
                touched: false,
                error: null
            },
            email: {
                value: null,
                touched: false,
                error: null
            },
            zipCode: {
                value: null,
                touched: false,
                error: null
            },
            state: {
                value: null
            },
            district: {
                value: null
            },
        },
        availableStates: [{display: 'Alabama', value: 'AB'}, {display: 'Alaska', value: 'AK'}, {display: 'New York', value: 'NY'}],
        availableDistricts: [{display: 'AB-1 (Johnson)', value: 1}, {display: 'AB-2 (Jones)', value: 2}],
        canSubmitForm: false
    };

    signUpClicked = (event) => {

    }

    validateInput = (value, identifier) => {
        let error = null;
        switch(identifier) {
            case 'firstName':
            case 'lastName':
                error = this.validateName(value);
                break;
            case 'email':
                error = this.validateEmail(value);
                break;
            case 'zipCode':
                error = this.validateZipCode(value);
                break;
            default:
                break;
        }
        return error;
    }

    validateName = (value) => {
        if (formValidation.isStringNullOrEmpty(value)) {
            return Error('Must not be empty');
        }
        if (formValidation.isStringBelowMinLength(value, 2)) {
            return Error('Must be at least 2 characters');
        }
    }

    validateEmail = (value) => {
        if (formValidation.isInvalidEmail(value)) {
            return Error('Invalid email address');
        }
    }

    validateZipCode = (value) => {
        if (formValidation.isStringBelowMinLength(value, 5) || formValidation.isStringAboveMaxLength(value, 5)) {
            return Error('Must be at least 5 characters');
        }
    }

    inputChangedHandler = (event, inputIdentifier) => {
        const updatedInput = { ...this.state.formInputs[inputIdentifier] };
        updatedInput.value = event.target.value;
        updatedInput.error = this.validateInput(updatedInput.value, inputIdentifier);
        // if (Object.keys(updatedFormElement).indexOf('error') !== -1) {
            
        // }
        updatedInput.touched = true;
        const updatedInputs = { ...this.state.formInputs };
        updatedInputs[inputIdentifier] = updatedInput;
        this.setState({
            formInputs: updatedInputs
        });
    }

    render() {  
        const {firstName, lastName, email, zipCode, state, district} = {...this.state.formInputs}
        const inlineStyles={
            CongressionalDistrictSelect: {
                width: '100%'
            }
        };
        return (
            <div className={styles.SignUp}>
                <Typography variant="h6" gutterBottom>
                    Sign Up
                </Typography>
                <Paper>
                    <form onSubmit={this.signUpClicked}>
                        <Grid container spacing={8}>
                            <Grid item xs={12}>
                                <FormControl className={ styles.InputFormControl } key="firstName" error={firstName.error != null}>
                                    <InputLabel>First Name</InputLabel>
                                    <Input 
                                        name="first-name"
                                        tabIndex="1"
                                        autoComplete="given-name"
                                        type="text"
                                        placeholder="First Name"
                                        value={firstName.value || ''} 
                                        onChange={(event) => {this.inputChangedHandler(event, "firstName");}} />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl className={ styles.InputFormControl } key="lastName" error={lastName.error != null}>
                                    <InputLabel>Last Name</InputLabel>
                                    <Input 
                                        name="last-name"
                                        tabIndex="2"
                                        autoComplete="family-name"
                                        type="text"
                                        placeholder="Last Name"
                                        value={lastName.value || ''} 
                                        onChange={(event) => {this.inputChangedHandler(event, "lastName");}} />
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl className={ styles.InputFormControl } key="email" error={email.error != null}>
                                <InputLabel>Email</InputLabel>
                                <Input 
                                    name="email"
                                    tabIndex="3"
                                    autoComplete="email"
                                    type="email"
                                    placeholder="Email Address"
                                    value={email.value || ''} 
                                    onChange={(event) => {this.inputChangedHandler(event, "email");}} />
                            </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl className={ styles.InputFormControl } key="zipCode" error={zipCode.error != null}>
                                <InputLabel>Zip Code</InputLabel>
                                <Input 
                                    name="zip-code"
                                    tabIndex="4"
                                    autoComplete="postal-code"
                                    type="text"
                                    placeholder="Zip Code"
                                    value={zipCode.value || ''} 
                                    onChange={(event) => {this.inputChangedHandler(event, "zipCode");}} />
                            </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormGroup
                                row
                                key="congressionalDistrict">
                                    <Grid container spacing={8}>
                                        <Grid item xs={12}>
                                            <FormControl key="state" tabIndex="5">
                                                <InputLabel>State</InputLabel>
                                                <Select
                                                    style={inlineStyles.CongressionalDistrictSelect} 
                                                    value={state.value  || ''}
                                                    onChange={(event, child) => { this.inputChangedHandler(event, "state"); }}>
                                                        {
                                                            this.state.availableStates.map((item) => {
                                                                return <MenuItem value={ item.value } key={ item.value }>{ item.display }</MenuItem>;
                                                            })
                                                        }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <FormControl autoWidth key="district" tabIndex="6">
                                                <InputLabel>CongressionalDistrict</InputLabel>
                                                <Select 
                                                    value={district.value || ''}
                                                    onChange={(event, child) => { this.inputChangedHandler(event, "district"); }}>
                                                        {
                                                            this.state.availableDistricts.map((item) => {
                                                                return <MenuItem value={ item.value } key={ item.value }>{ item.display }</MenuItem>;
                                                            })
                                                        }
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                    </Grid>
                            </FormGroup>
                            </Grid>
                            <Grid item xs={12}>
                                <Button component="button" variant="contained" color="default">Sign Up</Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </div>
        )
    }
}

export default SignUp;
