import React, { Component } from 'react';
import {Button, Card, Col, Empty, Row, Spin, Skeleton, Tabs} from 'antd';
import { Redirect } from 'react-router-dom';

import axios from '../../util/axios-api';
import SimpleLayout from '../Layout/SimpleLayout/SimpleLayout';



import styles from './CallIn.module.css';

class CallIn extends Component {

    state = {
        repLastName: null,
        state: null,
        district: null,
        talkingPoints: null,
        offices: null,
        fetchCallInError: null,
        identifier: null,
        didCall: false
    }

    handleICalled = () => {
        const reportBody = this.state.identifier ? { identifier: this.state.identifier } : {};
            axios.put('report-call', reportBody).then((response) => {
                // nothing for now
            }).catch((error) => {
               //nothing for now 
            }).then(() => {
                this.setState({
                    didCall: true
                });
            });
    }

    removeGetArgs = () => {
        this.props.history.push({
            pathname: this.props.history.location.pathname,
            search: '',
            state: {...this.state}
          })
    }

    saveIdentifier = () => {
        const urlParams = new URLSearchParams(this.props.location.search.slice(1));
        const identifier = urlParams.get('track');
        this.setState({
            identifier: identifier
        });
    }

    fetchCongressionalDistricts = () => {
        const pathComponents = this.props.history.location.pathname.split('/');
        axios.get(`call-in-details?state=${pathComponents[2]}&district=${pathComponents[3]}`).then((response)=>{
            const data = response.data;
            this.setState({
                repLastName: data.repLast,
                state: data.state,
                district: data.district,
                talkingPoints: data.talkingPoints,
                offices: data.offices
            })
        }).catch((error)=>{
            this.setState({
                fetchCallInError: error
            })
        });
    }

    componentDidMount() {
        this.saveIdentifier();
        this.removeGetArgs();
        this.fetchCongressionalDistricts();
    }

    render() {
        if (this.state.didCall) {
            let search = `?state=${this.state.state}&district=${this.state.district}`
            if (this.state.identifier) {
                search += `&track=${this.state.identifier}}`
            }
            return <Redirect
                to={{
                pathname: "/call/thankyou",
                search: search
                }}
            />;
        }

        return (
            <SimpleLayout activeLinkKey="/">
                {this.state.fetchCallInError ? this.getErrorJSX() : this.getCallInJSX() }
            </SimpleLayout>
        );
    }

    getErrorJSX = () => {
        const error = (
            <Empty style={{marginTop: '20px', marginBottom: '20px'}}description="There was an error fetching the call-in information. Please try again later." />
        );
        return error;
    }

    getCallInJSX = () => {
        const callIn = (this.state.repLastName) ? (
            <>
                <div className={styles.CallIn}>
                    <section id="title">
                        <Row>
                            <Col span={24}>
                                <h1 style={{fontSize: "1.7em"}}>{ `Call-In Guide: Rep. ${this.state.repLastName} (${this.state.state}-${this.state.district})` }</h1>
                            </Col>
                        </Row>
                    </section>
                    <section id="instructions">
                        <Card type="inner" className={styles.Block} title={(<h2>How this works</h2>)}>
                            <Row>
                                <Col sm={24} md={12} className={styles.InstructionsSubSection}>
                                    <h3>The Call</h3>
                                    <p>Calling is simple, fast and non-threatening. You will either talk to a young staff member (not Rep. {this.state.repLastName}) or you will get a recording. Staff will not quiz you.</p>
                                    <p>They just want to know your name and address so they can confirm you live in District {this.state.district}. Then they will listen and make notes while you tell them your talking points. They will thank you, and you’re done. Simple as that.</p>
                                </Col>
                                <Col sm={24} md={12} className={styles.InstructionsSubSection}>
                                    <h3>Rep. {this.state.repLastName} ({ this.state.state }-{ this.state.district }) </h3>
                                    <Row>
                                        <Col xs={24} sm={12} className={styles.HeadShot}>
                                            <img src={`https://projectgrandcanyon.com/assets/img/info/${this.state.repLastName}.jpg`.toLowerCase()} alt="" />
                                        </Col>
                                        <Col xs={24} sm={12} className={styles.Offices}>
                                            <h4>Offices</h4>
                                            <ul>
                                                { this.getOfficesJSX() }
                                            </ul>
                                            <p>Please call the office closest to you.</p>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card>
                    </section>
                    <section id="talking-points">
                        <Card type="inner" className={styles.Block} title={(<><h2>Talking Points</h2><span className={styles.Explanation}>Choose One</span></>)}>
                            <Row>
                                <Col span={24}>
                                <Tabs onChange={this.didSelectTab} >
                                    { this.getTalkingPointsJSX() }
                                </Tabs>
                                </Col>
                            </Row>
                        </Card>
                    </section>
                </div>
            </>
        ) : (
            <div className={styles.Loading}>
                <Spin />
            </div>
        );
        return callIn;
    }

    getOfficesJSX = () => {
        const offices = this.state.offices ? this.state.offices.map((office, idx)=>{
            return(<li key={idx}><p>{office}</p></li>);
        }) : null;
        return offices;
    }

    getTalkingPointsJSX = () => {
        const talkingPoints = (this.state.talkingPoints) ? this.state.talkingPoints.map((talkingPoint, idx) => {
            const gratitude = talkingPoint.gratitude ? (
                    <>
                        <h3 className={styles.TPSubHeading}>1. Gratitude</h3>
                        <h4 className={styles.Explanation}>A recent action by Rep. Williams you can thank him for:</h4>
                        <p>{talkingPoint.gratitude}
                        {talkingPoint.gratitudeLink && 
                        <span> (<a rel="noopener noreferrer" target="_blank" href={talkingPoint.gratitudeLink}>Background Info</a>)</span>
                    }</p>
                    </>
                ) : null;
            let stepNumber = gratitude ? 2 : 1;
            const education = talkingPoint.education ? (
                <>
                    <h3 className={styles.TPSubHeading}>{stepNumber}. Education</h3>
                    <h4 className={styles.Explanation}>A climate fact or event recently in the news:</h4>
                    <p>{talkingPoint.education}
                    {talkingPoint.educationLink && 
                        <span> (<a rel="noopener noreferrer" target="_blank" href={talkingPoint.educationLink}>Background Info</a>)</span>
                    }</p>
                </>
            ) : null;
            stepNumber = education ? stepNumber + 1 : stepNumber;
            const request = talkingPoint.request ? (
                <>
                    <h3 className={styles.TPSubHeading}>{stepNumber}. Request</h3>
                    <h4 className={styles.Explanation}>A specific requests for Rep. Williams:</h4>
                    <p>{talkingPoint.request}
                    {talkingPoint.requestLink && 
                        <span> (<a rel="noopener noreferrer" target="_blank" href={talkingPoint.requestLink}>Background Info</a>)</span>
                    }</p>
                </>
            ) : null;
            stepNumber = request ? stepNumber + 1 : stepNumber;
            return (
                <Tabs.TabPane tab={`${talkingPoint.theme}`} key={idx}>
                    {gratitude}
                    {education}
                    {request}
                    <h3 className={styles.TPSubHeading}>{stepNumber}. Report Your Call</h3>
                    <Button type="primary" style={{width: '200px'}} onClick={this.handleICalled}>I called!</Button>
                </Tabs.TabPane>);
        }) : null;
        return talkingPoints;
    }
}

export default CallIn;
