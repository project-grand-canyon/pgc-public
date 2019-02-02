import React, { Component } from 'react';
import { Button, Cascader, Checkbox, Empty, Col, Form, Input, Modal, Row, Spin } from 'antd';

import axios from '../../../util/axios-api';
import groupBy from '../../../util/groupBy';

import styles from './SignUpForm.module.css';

class SignUpForm extends Component {

    state={
        communicationMethods: new Set([]),
        congressionalDistricts: null,
        congressionalDistrictsError: null
    };

    componentDidMount = () => {
        axios.get('districts').then((response)=>{

            const houseOfRepDistricts = response.data.filter((district) => { return parseInt(district.number) > 0 });

            this.setState({
                congressionalDistricts: houseOfRepDistricts
            });

            const districtsByState = groupBy(houseOfRepDistricts, 'state');
            console.log(districtsByState);
            const cascaderDistricts = Object.keys(districtsByState).sort().map((state)=>{
                return {
                    value: state,
                    label: state,
                    children: districtsByState[state].sort((a, b)=> {
                        return parseInt(a.number) - parseInt(b.number)
                    }).map((district) =>{
                        return {
                            value: district.number,
                            label: `${state}-${district.number} (${district.repLastName})`
                        }
                    })
                }
            })

            this.setState({
                cascaderDistricts: cascaderDistricts
            });
        })
        .catch((error) =>{
            this.setState({
                congressionalDistrictsError: error
            });
            Modal.error({
                title: 'There was an error loading the form',
                content: `${error.message}`,
              });
        });
    }

    handleSubmit = (event) => {
        event.preventDefault();
        this.props.form.validateFieldsAndScroll();
        const fieldsErrors = this.props.form.getFieldsError();
        const errors = Object.keys(fieldsErrors).map(key => fieldsErrors[key] ).filter((value) => value)
        if(errors.length !== 0) {
            return;
            
        }
        const fieldValues = this.props.form.getFieldsValue();
        fieldValues['districtId'] = this.state.congressionalDistricts.find((district)=>{
            return district.state === fieldValues.congressionalDistrict[0] && district.number === fieldValues.congressionalDistrict[1];
        }).districtId;
        console.log(fieldValues)
        if (fieldValues.districtId) {
            console.log(fieldValues)
            this.props.onSuccessfulSubmit(fieldValues);
        }
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
        this.setState({ communicationMethods: newCommunicationMethods });
    }

    render() {
        if (this.state.congressionalDistrictsError !== null) {
            return <Empty description="There was an error loading this form. Please try again later." />
        }

        if (this.state.cascaderDistricts === null) {
            return <div className={styles.SpinContainer}><Spin size="large" /></div>;
        }

        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
              sm: { span: 24 },
              md: { span: 8 }
            },
            wrapperCol: {
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
                                <Cascader options={this.state.cascaderDistricts} onChange={(value, selectedOptions) => {
                                    const values = {...value}
                                    console.log(value);
                                    console.log(selectedOptions);
                                    values.state = value[0];
                                    values.districtNumber = value[1];
                                }} placeholder="Please select" />
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
