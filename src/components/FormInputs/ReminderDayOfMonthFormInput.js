import React from "react";
import { Form, Select } from "antd";

const getDays = () => {
    const days = []
    while (days.length < 31) {
        days.push(days.length + 1)
    }
    const mydays = days.map((day) => {
        return (
            <Select.Option key={day} value={day}>{day}</Select.Option>
        )
    })
    return mydays
}

const input = (props) => {
  return (
    <Form.Item {...props.formItemLayout} label="Notification Day (of month)">
        {props.getFieldDecorator('reminderDayOfMonth', {
            initialValue: props.day
        })(
            <Select>
                {getDays()}
            </Select>
        )}
        </Form.Item>
  );
};

export default input;
