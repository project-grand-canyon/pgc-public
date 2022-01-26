import React from "react";
import { Form, Input } from "antd";

const input = (props) => {
  return (
    <Form.Item {...props.formItemLayout} label="First Name">
      {props.getFieldDecorator("firstName", {
        rules: [{ required: true, message: "Please input your first name." }],
        initialValue: props.firstName || "",
      })(<Input />)}
    </Form.Item>
  );
};

export default input;
