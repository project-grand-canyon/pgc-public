import React from "react";
import { Form, Input } from "antd";

const input = (props) => {
  return (
    <Form.Item {...props.formItemLayout} label="Last Name">
      {props.getFieldDecorator("lastName", {
        rules: [{ required: true, message: "Please input your last name." }],
        initialValue: props.lastName || "",
      })(<Input />)}
    </Form.Item>
  );
};

export default input;
