import React, { Component } from 'react';
import { Button, Empty, Form, Modal } from 'antd';

import axios from '../../../util/axios-api';
import ContactMethodsFormInput from '../../../components/FormInputs/ContactMethodsFormInput';
import EmailFormInput from '../../../components/FormInputs/EmailFormInput';
import PhoneFormInput from '../../../components/FormInputs/PhoneFormInput';
import FirstNameFormInput from '../../../components/FormInputs/FirstNameFormInput';
import LastNameFormInput from '../../../components/FormInputs/LastNameFormInput';
import ZIPFormInput from '../../../components/FormInputs/ZIPFormInput';
import DistrictFormInput from '../../../components/FormInputs/DistrictFormInput';

import styles from './SignUpForm.module.css';

class SignUpForm extends Component {

    state={
        communicationMethods: new Set([]),
        districts: null,
        districtsError: null
    };

    componentDidMount = () => {
        axios.get('districts').then((response)=>{
            this.setState({
                districts: response.data
            });
        })
        .catch((error) =>{
            this.setState({
                districtsError: error
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
        fieldValues['district'] = this.state.districts.find((district)=>{
            return district.state === fieldValues.congressionalDistrict[0] && district.number === fieldValues.congressionalDistrict[1];
        });
        if (fieldValues.district) {
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
        if (this.state.districtsError !== null) {
            return <Empty description="There was an error loading this form. Please try again later." />
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
                span: 8,
                offset: 8,
              },
            },
          };

        const phoneInput = this.state.communicationMethods.has('sms') ? <PhoneFormInput formItemLayout={formItemLayout} getFieldDecorator={getFieldDecorator} /> : null;

        return (
            <div className={styles.SignUpForm}>
                <div>
                    <Form onSubmit={this.handleSubmit}>
                        <FirstNameFormInput formItemLayout={formItemLayout} getFieldDecorator={getFieldDecorator} />
                        <LastNameFormInput formItemLayout={formItemLayout} getFieldDecorator={getFieldDecorator} />
                        <ContactMethodsFormInput formItemLayout={formItemLayout} getFieldDecorator={getFieldDecorator} handleToggleEmail={this.handleToggleEmail} handleToggleSMS={this.handleToggleSMS} />
                        {phoneInput}
                        <EmailFormInput formItemLayout={formItemLayout} getFieldDecorator={getFieldDecorator} />
                        <ZIPFormInput formItemLayout={formItemLayout} getFieldDecorator={getFieldDecorator} />
                        <DistrictFormInput formItemLayout={formItemLayout} getFieldDecorator={getFieldDecorator} districts={this.state.districts} />
                        <Form.Item {...tailFormItemLayout}>
                            <Button block type="primary" htmlType="submit" className={styles.RegisterButton}>Register</Button>
                        </Form.Item>
                        
                    </Form>
                </div>
            </div>
        )
    }
}

export default Form.create({})(SignUpForm);
