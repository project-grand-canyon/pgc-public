import React from 'react';
import { Button, Typography } from 'antd';
import { ReactComponent as CapitolIcon } from '../../assets/images/capitol-building.svg';
import styles from './Hero.module.css';

const hero = (props) => {
    return (
        <div className={styles.Hero}>
            <CapitolIcon className={styles.capitol} />
            <Typography.Text>Make a difference</Typography.Text>
            <Typography.Title level={1} style={{marginTop: "10px", marginBottom: "10px"}}>Call Congress for Climate</Typography.Title>
            <Typography.Text>By Citizens' Climate Lobby</Typography.Text>
            <div className={styles.CTAs}>
                <Button block className={styles.CTA} onClick={props.onStartCalling} size="large" type="primary">Start Calling</Button>
                <Button block className={styles.CTA} onClick={props.onMoreInfo} size="large">More Info</Button>
            </div>
        </div>
    );
};

export default hero;
