import React from 'react';
import { Button, Divider, Typography } from 'antd';

import styles from './Hero.module.css';

const hero = (props) => {
    return (
        <div className={styles.Hero}>
            <Typography.Title level={3}>Citizens' Climate Lobby's</Typography.Title>
            <Typography.Title level={1}>Project Grand Canyon</Typography.Title>
            <Typography.Title level={3}>Make a Difference on Climate Change With a Phone Call</Typography.Title>
            <Divider style={{width:"50%"}} />
            <Button className={styles.CTA} onClick={props.actioned} size="large" type="default">Sign Up</Button>
        </div>
    );
};

export default hero;
