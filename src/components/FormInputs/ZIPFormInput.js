import React from "react";
import { Form, Input } from "antd";

const input = (props) => {
  return (
    <Form.Item {...props.formItemLayout} label="Zip Code">
      {props.getFieldDecorator("zipCode", {
        rules: [
          {
            pattern: /^[0-9]+$/,
            message: "Zip code can only contain numbers.",
          },
          { len: 5, message: "Zip code must be 5 characters." },
        ],
        validateFirst: true,
        validateTrigger: "onBlur",
        initialValue: props.zip || "",
      })(<Input />)}
    </Form.Item>
  );
};

export default input;
