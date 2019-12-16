import React from 'react';
import { Button, Col, Row, Typography} from 'antd';

import styles from './BottomHero.module.css';

const bottomHero = (props) => {
    return (
        <Row className={styles.BottomHero}>
            <Col xs={24} lg={12} className={styles.Text}>
                <Typography.Title className={styles.Heading} level={4}>Are you ready?</Typography.Title>
                <Typography.Paragraph className={styles.Paragraph}>Don't know who your Member of Congress is? Find out at <a href="https://www.house.gov/representatives/find-your-representative" target="_blank" rel="noopener noreferrer">house.gov</a>, then sign up!</Typography.Paragraph>
            </Col>

            <Col xs={24} lg={12}>
                <Button block type="primary" onClick={props.onStartCalling}>Sign Up</Button>
            </Col>
        </Row>
    );
};

export default bottomHero;
