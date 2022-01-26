import React from "react";
import { Form, Checkbox } from "antd";

const input = (props) => {
  return (
    <Form.Item {...props.formItemLayout} label="Pause Reminders">
      {props.getFieldDecorator("paused", {
        valuePropName: "checked",
        initialValue: props.paused || false,
      })(<Checkbox />)}
    </Form.Item>
  );
};

export default input;
