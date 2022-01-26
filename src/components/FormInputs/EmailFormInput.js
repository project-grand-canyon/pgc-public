import React from "react";
import { Form, Input } from "antd";

const input = (props) => {
  return (
    <Form.Item {...props.formItemLayout} label="Email">
            {props.getFieldDecorator('email', {
                validateTrigger: 'onBlur',
                rules: [
                    {type: 'email', message: 'The input is not a valid email.'},
                    {required: true, message: 'Please input your email.'}],
                initialValue: props.email || "",
            })(<Input />)}
        </Form.Item>
  );
};

export default input;
