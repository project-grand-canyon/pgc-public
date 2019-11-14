import React from 'react';
import { Button, Divider, Spin, Typography } from 'antd';

import styles from './Hero.module.css';

const hero = (props) => {

    const numberOfCallers = props.callerCount || <Spin size="small" />;

    return (
        <div className={styles.Hero}>
            <Typography.Title level={1}>Project Grand Canyon</Typography.Title>
            <Divider style={{width:"50%"}} />
            <Typography.Title level={4}>Join the {numberOfCallers} people nationwide who are making a difference on climate change with one phone call a month</Typography.Title>
            <Button className={styles.CTA} onClick={props.actioned} size="large" type="default">Sign Up</Button>
        </div>
    );
};

export default hero;
