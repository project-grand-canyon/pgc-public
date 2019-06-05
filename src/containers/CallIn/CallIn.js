import React, { Component } from 'react';
import {Button, Card, Col, Empty, Row, Spin, Typography, Tabs} from 'antd';
import { Redirect } from 'react-router-dom';

import axios_api from '../../util/axios-api';
import SimpleLayout from '../Layout/SimpleLayout/SimpleLayout';



import styles from './CallIn.module.css';

class CallIn extends Component {

    state = {
        repLastName: null,
        repFirstName: null,
        repImageUrl: null,
        state: null,
        district: null,
        districtId: null,
        talkingPoints: null,
        offices: null,
        fetchCallInError: null,
        identifier: null,
        didCall: false,
        callerId: null
    }

    handleICalled = () => {
        const reportBody = this.state.identifier ? { 
            callerId: parseInt(this.state.callerId),
            trackingId: this.state.identifier,
            districtId: this.state.districtId,
            talkingPointId: this.state.talkingPoints[0].talkingPointId
        } : {};
            axios_api.post('calls', reportBody).then((response) => {
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
        const identifier = urlParams.get('t');
        const caller = urlParams.get('c');
        this.setState({
            identifier: identifier,
            callerId: caller
        });
    }

    fetchCongressionalDistricts = () => {
        const pathComponents = this.props.history.location.pathname.split('/');
        const state = pathComponents[2]
        const district = pathComponents[3]

        if (!state || !district) {
            this.setState({
                fetchCallInError: "No district specified"
            })
            return;
        }

        axios_api.get('districts').then((response)=>{
            const districts = response.data;
            const foundDistrict = districts.find((el)=>{
                return (state.toLowerCase() == el.state.toLowerCase()) && (parseInt(district) == parseInt(el.number))
            })
            if(!foundDistrict){
                throw Error(`No call-in details found for ${state}-${district}`)
            }

            Promise.all(
                [
                    axios_api.get(`districts/${foundDistrict.districtId}/hydrated`), 
                    axios_api.get(`themes`)
                ])
                .then(values => {
                    const hydrated = values[0].data
                    const themes = values[1].data
                    console.log(hydrated.script)
                    const talkingPoints = [...hydrated.script].map(el=>{
                        const theme = themes.find((el2)=>{return el2.themeId === el.themeId})
                        el.theme = theme && theme.name || "Talking Point"
                        return el
                    })
                    this.setState({
                        repLastName: hydrated.repLastName,
                        repFirstName: hydrated.repFirstName,
                        repImageUrl: hydrated.repImageUrl,
                        requests: hydrated.requests,
                        state: hydrated.state,
                        district: hydrated.number,
                        talkingPoints: talkingPoints,
                        offices: hydrated.offices,
                        districtId: hydrated.districtId
                    })
                }).catch(e=>{
                    throw e
                });
        }).catch(e=>{
            this.setState({
                fetchCallInError: e
            })
        })
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
                search += `&t=${this.state.identifier}}`
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
                                <Typography.Title level={1}>{ `Call-In Guide: Rep. ${this.state.repFirstName} ${this.state.repLastName} (${this.state.state}-${this.state.district})` }</Typography.Title>
                            </Col>
                        </Row>
                    </section>
                    <section id="instructions">
                        <Card type="inner" className={styles.Block} title={(<Typography.Title level={2}>How this works</Typography.Title>)}>
                            <Row>
                                <Col sm={24} md={12} className={styles.InstructionsSubSection}>
                                    <Typography.Title level={3}>The Call</Typography.Title>
                                    <p>Calling is simple, fast and non-threatening. You will either talk to a young staff member (not Rep. {this.state.repLastName}) or you will get a recording. Staff will not quiz you.</p>
                                    <p>They just want to know your name and address so they can confirm you live in District {this.state.district}. Then they will listen and make notes while you tell them your talking points. They will thank you, and you’re done. Simple as that.</p>
                                </Col>
                                <Col sm={24} md={12} className={styles.InstructionsSubSection}>
                                    <Typography.Title level={3}>
                                        Rep. {this.state.repFirstName} {this.state.repLastName} ({ this.state.state }-{ this.state.district })
                                    </Typography.Title>
                                    <Row>
                                        <Col xs={24} sm={12} className={styles.HeadShot}>
                                            <img src={`${this.state.repImageUrl}`} alt="" />
                                        </Col>
                                        <Col xs={24} sm={12} className={styles.Offices}>
                                            <Typography.Text strong>Offices</Typography.Text>
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
                        <Card type="inner" className={styles.Block} title={(<Typography.Title level={2}>Call-In Script</Typography.Title>)}>
                            {this.getIntroJSX()}
                            {this.getTalkingPointsJSX()}
                            {this.getRequestJSX()}
                            {this.getReportYourCallButtonJSX()}
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

    getIntroJSX = () => {
        return <>
            <Typography.Title level={3}>Introduction:</Typography.Title>
            <Typography.Paragraph>Hello, my name is __________, and I live in district {this.state.district}. I am calling about climate change.</Typography.Paragraph>
        </>
    }

    getOfficesJSX = () => {
        const offices = this.state.offices ? this.state.offices.map((office, idx)=>{
            return(<li key={idx}><p>{`${office.address.city}: ${office.phone}`}</p></li>);
        }) : null;
        return offices;
    }

    getTalkingPointsJSX = () => {
        const talkingPoints = (this.state.talkingPoints) ? this.state.talkingPoints.map((talkingPoint, idx) => {
            const education = talkingPoint.content ? (
                <>
                    
                    <Typography.Paragraph>{talkingPoint.content}
                    {talkingPoint.referenceUrl && 
                        <span> (<a rel="noopener noreferrer" target="_blank" href={talkingPoint.referenceUrl}>Background Info</a>)</span>
                    }
                    </Typography.Paragraph>
                </>
            ) : null;
            return (
                <Tabs.TabPane tab={`${talkingPoint.theme}`} key={idx}>
                    {education}
                </Tabs.TabPane>);
        }) : null;
        return(
            <>
                <Typography.Title level={3}>Talking Point:</Typography.Title>
                <Typography.Text style={{fontStyle:"italic"}}>Talking points provide information that connects climate change to your local area. Choose one.</Typography.Text>
                <Row>
                    <Col span={24}>
                    <Tabs onChange={this.didSelectTab} >
                        { talkingPoints }
                    </Tabs>
                    </Col>
                </Row>
            </>
        )
    }

    getReportYourCallButtonJSX = () => {
        return (
            <>
                <Typography.Title level={3}>Report Your Call:</Typography.Title>
                <Button type="primary" style={{width: '200px'}} onClick={this.handleICalled}>I called!</Button>
            </>
        );
    }

    getRequestJSX = () => {
        return this.state.requests ? (
            <>
                <Typography.Title level={3}>Request:</Typography.Title>
                <Typography.Text style={{fontStyle:"italic"}}>A specific requests for Rep. {this.state.repLastName}:</Typography.Text>
                {/* <h3 className={styles.TPSubHeading}>Request</h3>
                <h4 className={styles.Explanation}>A specific requests for Rep. Williams:</h4> */}
                {this.state.requests[0] && 
                    <Typography.Paragraph>{this.state.requests[0].content}</Typography.Paragraph>
                }
            </>
        ) : null;
        
    }
}

export default CallIn;
