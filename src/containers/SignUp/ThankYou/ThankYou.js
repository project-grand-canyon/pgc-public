import React, { Component } from 'react';
import { Button, Row, Col } from 'antd';
import { Redirect } from 'react-router-dom';

import ResponsiveLayout from '../../Layout/ResponsiveLayout/ResponsiveLayout';
import getUrlParameter from '../../../util/urlparams';

import capitol from '../../../assets/images/ccl-capitol.jpg'
import styles from './ThankYou.module.css';

class ThankYou extends Component {

    state = {
        makeFirstCall: false,
        state: null,
        district: null,
        communicationMethod: null
    }

    handleMakeCallClick = (event) => {
        console.log('hi');
        this.setState({
            makeFirstCall: true
        })
    }

    componentDidMount = () => {

        const params = this.props.location.search;
        const communicationMethods = getUrlParameter(params, 'com').split('-');
        const communicationMethod = communicationMethods.length > 1 ? communicationMethods.join(' and ') : communicationMethods[0]
        this.setState({
            communicationMethod: communicationMethod,
            state: getUrlParameter(params, 'state'),
            district: getUrlParameter(params, 'district')
        });
    }

    render() {  


        if (this.state.makeFirstCall) {
            return <Redirect
                to={{pathname: `/call/${this.state.state}/${this.state.district}`}}
            />;
        }

        return (
            <ResponsiveLayout activeLinkKey="/signup">
                <div className={styles.ThankYou}>
                    <Row type="flex" justify="center">
                        <Col xs={24} sm={24} md={18} lg={12}>
                            <div className={styles.ContentBlock}>
                                <h2>
                                    Thank You for Signing Up
                                </h2>
                                <span>
                                    You will be getting confirmation by { this.state.communicationMethod } shortly, and you will be added to the call-in schedule for each month.
                                </span>
                                <img src={capitol} className={styles.Photo} alt="U.S. Capitol Building" />
                                <div className={styles.CantWait}>
                                    <h3>Can't wait to start calling?</h3>
                                    <Button onClick={this.handleMakeCallClick} className={styles.MakeCall} type="primary">Make your first call now!</Button>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </ResponsiveLayout>
        )
    }
}

export default ThankYou;
