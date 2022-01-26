import React from "react";
import { Form, Input } from "antd";

const input = (props) => {
  return (
    <Form.Item {...props.formItemLayout} label="Phone Number">
      {props.getFieldDecorator("phone", {
        validateTrigger: "onBlur",
        rules: [
          {
            pattern: /^[0-9]{10}$/,
            message: "Phone number must be 10 digits (ex. 8882224444).",
          },
          { required: true, message: "Please input your phone number." },
        ],
        initialValue: props.phone.replace(/-/g, "") || "",
      })(<Input />)}
    </Form.Item>
  );
};

export default input;
