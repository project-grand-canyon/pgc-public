import React from 'react';
import { Button, Divider } from 'antd';

import styles from './Hero.module.css';

const hero = (props) => {
    return (
        <div className={styles.Hero}>
            <h3>Citizens' Climate Lobby's</h3>
            <h1>Project Grand Canyon</h1>
            <h3>Make a Difference on Climate Change With a Phone Call</h3>
            <Divider style={{width:"50%"}} />
            <Button className={styles.CTA} onClick={props.actioned} size="large" type="default">Sign Up</Button>
        </div>
    );
};

export default hero;
