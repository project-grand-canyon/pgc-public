import React from "react";
import { Cascader, Form } from "antd";
import groupBy from "../../util/groupBy";

const input = (props) => {

    const districts = props.districts || [];
    const houseOfRepDistricts = districts.filter((district) => { return parseInt(district.number) >= 0 });
    
    const initialDistrict = districts.filter((district) => { return district.districtId === props.districtId });
    const districtsByState = groupBy(houseOfRepDistricts, 'state');
    const cascaderDistricts = Object.keys(districtsByState).sort().map((state)=>{
        return {
            value: state,
            label: state,
            children: districtsByState[state].sort((a, b)=> {
                return parseInt(a.number) - parseInt(b.number)
            }).map((district) =>{
                return {
                    value: district.number,
                    label: `${state}-${district.number} (${district.repLastName})`
                }
            })
        }
    })

  return (
    <Form.Item
        {...props.formItemLayout}
        label="Congressional District"
        extra={
            <>
            <span>
                <a
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.house.gov/representatives/find-your-representative"
                >
                Don't know? Find it here.
                </a>
            </span>
            </>
        }>
        {props.getFieldDecorator("congressionalDistrict", {
            rules: [
            { required: true, message: "Please select your congressional district." },
            ],
            initialValue: initialDistrict.length > 0 ? [initialDistrict[0].state, initialDistrict[0].number] : [],
        })(
            <Cascader
            options={cascaderDistricts}
            onChange={(value, _ ) => {
                const values = { ...value };
                values.state = value[0];
                values.districtNumber = value[1];
            }}
            placeholder="Please select"
            />
        )}
        </Form.Item>);
};

export default input;
