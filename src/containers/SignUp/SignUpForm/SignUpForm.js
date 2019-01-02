import React, { Component } from 'react';
import { Button, Cascader, Checkbox, Col, Form, Icon, Input, Row, Tooltip } from 'antd';

import congressionalDistricts from '../../../util/CongressionalDistrictProvider';

import ResponsiveLayout from '../../Layout/ResponsiveLayout';

import styles from './SignUpForm.module.css';

class SignUpForm extends Component {

    state={
        communicationMethods: new Set([])
    };

    congressionalDistrictSelectChoices = congressionalDistricts.map((state) => {
      return {
            value: state.abbreviation,
            label: state.name,
            children: state.districts.map((district)=>{
                return {
                    value: district.label, 
                    label: `${state.abbreviation}-${district.label} (${district.rep})`
                };
            })
        };
    });

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll();
        const fieldsErrors = this.props.form.getFieldsError();
        const errors = Object.keys(fieldsErrors).map(key => fieldsErrors[key] ).filter((value) => value)
        if(errors.length === 0) {
            console.log(this.props.form.getFieldsValue())
        }
    }

    handleCongressionalDistrictSelection = (event) => {
        console.log(event);
    }

    handleToggleSMS = (e) => {
        const desiresSMS = e.target.checked;
        this.handleCommunicationToggle('sms', desiresSMS)
    }

    handleToggleEmail = (e) => {
        const desiresEmail = e.target.checked;
        this.handleCommunicationToggle('email', desiresEmail)
    }

    handleCommunicationToggle(method, desiresMethod) {
        const newCommunicationMethods = new Set([...this.state.communicationMethods]);
        if ( desiresMethod ) {
            newCommunicationMethods.add(method);
        } else {
            newCommunicationMethods.delete(method);
        }
        console.log(newCommunicationMethods);
        this.setState({ communicationMethods: newCommunicationMethods });
    }

    handleCommunicationSelection = (value) => {
        console.log(value);
    }

    inputChangedHandler = (event, inputIdentifier) => {
        console.log('input changed');
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
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 24 },
              md: { span: 8 }
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 24 },
              md: { span: 8 }
            },
          };
          const tailFormItemLayout = {
            wrapperCol: {
              xs: {
                span: 24,
                offset: 0,
              },
              md: {
                span: 16,
                offset: 8,
              },
            },
          };

        const emailInput = this.state.communicationMethods.has('email') ? (
        <Form.Item {...formItemLayout} label="Email">
            {getFieldDecorator('email', {
                validateTrigger: 'onBlur',
                rules: [
                    {type: 'email', message: 'The input is not a valid email.'},
                    {required: true, message: 'Please input your email.'}]
            })(<Input />)}
        </Form.Item>) : null;

        const phoneInput = this.state.communicationMethods.has('sms') ? (
        <Form.Item {...formItemLayout} label="Phone Number" >
            {getFieldDecorator('phone', {
                validateTrigger: 'onBlur',
                rules: [{ pattern: /^[0-9]{10}$/, message: 'Phone number must be 10 digits (ex. 8882224444).' },
                        { required: true, message: 'Please input your phone number.' }]
            })(<Input />)}
        </Form.Item> ) : null;

        return (
            <div className={styles.SignUpForm}>
                <div>
                    <Form onSubmit={this.handleSubmit}>
                        <Form.Item {...formItemLayout} label="First Name">
                            {getFieldDecorator('firstName', {
                                rules: [{required: true, message: 'Please input your first name.'}]
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="Last Name">
                            {getFieldDecorator('lastName', {
                                rules: [{required: true, message: 'Please input your last name.'}]
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="How should we contact you?">
                        {getFieldDecorator("checkbox-group", {
                            initialValue: [],
                            rules: [{required: true, message: 'Please select at least one communication method.'}]
                        })(
                            <Checkbox.Group style={{ width: "100%" }}>
                            <Row>
                                <Col onChange={this.handleToggleSMS} span={12}><Checkbox value="sms">Text Message</Checkbox></Col>
                                <Col onChange={this.handleToggleEmail} span={8}><Checkbox value="email">Email</Checkbox></Col>
                            </Row>
                            </Checkbox.Group>
                        )}
                        </Form.Item>
                        {phoneInput}
                        {emailInput}
                        <Form.Item {...formItemLayout} label="Zip Code">
                            {getFieldDecorator('zipCode', {
                                rules: [{required: true, message: 'Please input your zip code.'},
                                        {pattern: /^[0-9]+$/, message: 'Zip code can only contain numbers.'},
                                        {len: 5, message: 'Zip code must be 5 characters.'}],
                                validateFirst: true,
                                validateTrigger: 'onBlur' 
                            })(<Input />)}
                        </Form.Item>
                        <Form.Item 
                            {...formItemLayout} 
                            label="Congressional District"
                            extra={
                                <>
                                    <span><a rel="noopener noreferrer" target="_blank" href="https://www.house.gov/representatives/find-your-representative">Don't know? Find it here.</a></span>
                                </>
                            }>
                            {getFieldDecorator('congressionalDistrict', {
                                rules: [{required: true, message: 'Please select your congressional district.'}]
                            })(
                                <Cascader options={this.congressionalDistrictSelectChoices} onChange={this.handleCongressionalDistrictSelection} placeholder="Please select" />
                            )}
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" className={styles.RegisterButton}>Register</Button>
                        </Form.Item>
                        
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create({})(SignUpForm);
