import React from 'react';
import { Button, Col, Row, Typography} from 'antd';

import styles from './BottomHero.module.css';

const bottomHero = (props) => {
    return (
        <Row className={styles.BottomHero}>
            <Col span={8} className={styles.Text}>
                <Typography.Title className={styles.Heading} level={4}>Are you ready?</Typography.Title>
                <Typography.Paragraph className={styles.Paragraph}>Don't know who your Member of Congress is? Find out at <a href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noopener noreferrer">house.gov</a>, then sign up!</Typography.Paragraph>
            </Col>

            <Col span={4}>
                <Button onClick={props.actioned}>Sign Up</Button>
            </Col>
        </Row>
    );
};

export default bottomHero;
