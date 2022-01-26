import React from "react";
import { Form, Checkbox, Col, Row } from "antd";

const input = (props) => {
  console.log(props)
  return (
    <Form.Item {...props.formItemLayout} label="How should we contact you?">
      {props.getFieldDecorator("contactMethods", {
        initialValue: (props.contactMethods && Array.from(props.contactMethods)) || [],
        rules: [
          {
            required: true,
            message: "Please select at least one communication method.",
          },
        ],
      })(
        <Checkbox.Group style={{ width: "100%" }}>
          <Row>
            <Col onChange={props.handleToggleSMS} span={12}>
              <Checkbox value="sms">Text Message</Checkbox>
            </Col>
            <Col onChange={props.handleToggleEmail} span={8}>
              <Checkbox value="email">Email</Checkbox>
            </Col>
          </Row>
        </Checkbox.Group>
      )}
    </Form.Item>
  );
};

export default input;
