import React, { Component } from "react";
import { Button, Form, Skeleton, Typography } from "antd";

import ContactMethodsFormInput from "../../../components/FormInputs/ContactMethodsFormInput";
import EmailFormInput from "../../../components/FormInputs/EmailFormInput";
import PhoneFormInput from "../../../components/FormInputs/PhoneFormInput";
import FirstNameFormInput from "../../../components/FormInputs/FirstNameFormInput";
import LastNameFormInput from "../../../components/FormInputs/LastNameFormInput";
import ZIPFormInput from "../../../components/FormInputs/ZIPFormInput";
import DistrictFormInput from "../../../components/FormInputs/DistrictFormInput";
import emotion from '@emotion/styled';

const ErrorWrapper = emotion.div`
    margin: 1rem;
    padding 1rem 0;
    text-align: center;
`

class PreferencesForm extends Component {

  state = {
    communicationMethods: null,
  };

  componentDidUpdate = (prevProps) => {
    if (prevProps.caller !== this.props.caller) {
      this.setState({
        communicationMethods: new Set(this.props.caller.contactMethods),
      });
    }
  }

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.form.validateFieldsAndScroll();
    const fieldsErrors = this.props.form.getFieldsError();
    const errors = Object.keys(fieldsErrors)
      .map((key) => fieldsErrors[key])
      .filter((value) => value);
    if (errors.length !== 0) {
      return;
    }
    const fieldValues = this.props.form.getFieldsValue();
    fieldValues["district"] = this.props.districts.find((district) => {
      return (
        district.state === fieldValues.congressionalDistrict[0] &&
        district.number === fieldValues.congressionalDistrict[1]
      );
    });
    if (fieldValues.district) {
      this.props.onSuccessfulSubmit(fieldValues);
    }
  };

  handleToggleSMS = (e) => {
    const desiresSMS = e.target.checked;
    this.handleCommunicationToggle("sms", desiresSMS);
  };

  handleToggleEmail = (e) => {
    const desiresEmail = e.target.checked;
    this.handleCommunicationToggle("email", desiresEmail);
  };

  handleCommunicationToggle(method, desiresMethod) {
    const newCommunicationMethods = new Set([
      ...this.state.communicationMethods,
    ]);
    if (desiresMethod) {
      newCommunicationMethods.add(method);
    } else {
      newCommunicationMethods.delete(method);
    }
    this.setState({ communicationMethods: newCommunicationMethods });
  }

  render() {
    if (this.props.isFetching) {
      return <Skeleton active />;
    } else if (this.props.fetchError) {
        return (
<ErrorWrapper>
            <Typography.Title level={3}>Error</Typography.Title>

        <Typography.Text type="danger">{this.props.fetchError.message}</Typography.Text>
        <Typography.Paragraph>Are you certain you clicked the "settings page" link from your latest call-in guide?</Typography.Paragraph>
        </ErrorWrapper>
        );
    } else if (!this.props.districts || !this.props.caller || !this.state.communicationMethods) {

    }

    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        sm: { span: 24 },
        md: { span: 8 },
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 8 },
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

    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <FirstNameFormInput
            formItemLayout={formItemLayout}
            getFieldDecorator={getFieldDecorator}
            firstName={this.props.caller.firstName}
          />
          <LastNameFormInput
            formItemLayout={formItemLayout}
            getFieldDecorator={getFieldDecorator}
            lastName={this.props.caller.lastName}
          />
          <ContactMethodsFormInput
            formItemLayout={formItemLayout}
            getFieldDecorator={getFieldDecorator}
            handleToggleEmail={this.handleToggleEmail}
            handleToggleSMS={this.handleToggleSMS}
            contactMethods={this.state.communicationMethods}
          />
          <PhoneFormInput
            formItemLayout={formItemLayout}
            getFieldDecorator={getFieldDecorator}
            phone={this.props.caller.phone}
          />
          <EmailFormInput
            formItemLayout={formItemLayout}
            getFieldDecorator={getFieldDecorator}
            email={this.props.caller.email}
          />
          <ZIPFormInput
            formItemLayout={formItemLayout}
            getFieldDecorator={getFieldDecorator}
            zip={this.props.caller.zipCode}
          />
          <DistrictFormInput
            formItemLayout={formItemLayout}
            getFieldDecorator={getFieldDecorator}
            districts={this.props.districts}
            districtId={this.props.caller.districtId}
          />
          <Form.Item {...tailFormItemLayout}>
            <Button
              block
              type="primary"
              htmlType="submit"
            >
              Update Preferences
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create({})(PreferencesForm);
