import React, { Component } from 'react';
import { Alert, Button, Col, Collapse, Empty, Icon, List, Row, Spin, Typography} from 'antd';
import { Redirect } from 'react-router-dom';

import axios_api from '../../util/axios-api';
import { isSenatorDistrict, isAtLargeDistrict, displayName } from '../../util/district';
import SimpleLayout from '../Layout/SimpleLayout/SimpleLayout';

import styles from './CallIn.module.css';
import getUrlParameter from '../../util/urlparams';

class CallIn extends Component {

    state = {
        repLastName: null,
        repFirstName: null,
        repImageUrl: null,
        state: null,
        number: null,
        districtId: null,
        talkingPoints: null,
        offices: null,
        fetchCallInError: null,
        identifier: null,
        didCall: false,
        callerId: null,
        selectedTalkingPoint: 0,
        officesLocked: false,
        homeDistrict: null
    }

    handleICalled = () => {
        const reportBody = this.state.identifier ? { 
            callerId: parseInt(this.state.callerId),
            trackingId: this.state.identifier,
            districtId: this.state.districtId,
            talkingPointId: (this.state.selectedTalkingPoint && parseInt(this.state.selectedTalkingPoint.talkingPointId)) || 0
        } : {};
        axios_api.post('calls', reportBody).then((response) => {
            // nothing for now
        }).catch((error) => {
            // nothing for now 
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

    saveHomeDistrict = (params) => {
        const homeDistrict = getUrlParameter(params, 'd');
        this.setState({
            homeDistrict: homeDistrict
        });
    }

    saveIdentifier = (params) => {
        const identifier = getUrlParameter(params, 't');
        const caller = getUrlParameter(params, 'c');
        this.setState({
            identifier: identifier,
            callerId: caller
        });
    }

    fetchCongressionalDistricts = () => {
        const pathComponents = this.props.history.location.pathname.split('/');
        const state = pathComponents[2]
        const number = pathComponents[3]

        if (!state || !number) {
            this.setState({
                fetchCallInError: "No district specified"
            })
            return;
        }

        axios_api.get('districts').then((response)=>{
            const districts = response.data;
            const foundDistrict = districts.find((el)=>{
                return (state.toLowerCase() === el.state.toLowerCase()) && (parseInt(number) === parseInt(el.number))
            })
            if(!foundDistrict){
                throw Error(`No call-in details found for ${state}-${number}`)
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
                        el.theme = (theme && theme.name) || "Talking Point"
                        return el
                    })
                    this.setState({
                        repLastName: hydrated.repLastName,
                        repFirstName: hydrated.repFirstName,
                        repImageUrl: hydrated.repImageUrl,
                        requests: hydrated.requests,
                        state: hydrated.state,
                        number: hydrated.number,
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
        this.saveIdentifier(this.props.location.search);
        this.saveHomeDistrict(this.props.location.search);
        this.removeGetArgs();
        this.fetchCongressionalDistricts();
    }

    render() {
        if (this.state.didCall) {
            let search = `?state=${this.state.state}&district=${this.state.number}`
            if (this.state.identifier) {
                search += `&t=${this.state.identifier}}`
            }
            if (this.state.homeDistrict) {
                search += `&d=${this.state.homeDistrict}`
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
        const offices = this.state.offices;
        const yourLegislator = isSenatorDistrict(this.state) ? "Your Senator:" : " Your Representative:";
        const title = isSenatorDistrict(this.state) ? 
        `${this.state.repFirstName} ${this.state.repLastName} (${displayName(this.state)})` :
        `${this.state.repFirstName} ${this.state.repLastName} (${displayName(this.state)})`;

        const callIn = (this.state.repLastName) ? (
            <>
                <div className={styles.CallIn}>
                    <section>
                    <Row type="flex" justify="center" className={styles.HeaderRow}>
                            <Col xs={24} md={20} lg={18} xl={12}>
                                <Typography.Title level={2}>Call-In Guide:</Typography.Title>
                            </Col>
                        </Row>
                        <Row type="flex" justify="center"><Col xs={24} md={20} lg={18} xl={12}>
                        <Row type="flex" align="middle">
                            <Col xs={24} md={8} lg={6} xl={4}>
                                <Row className={styles.ContentRow} type="flex" justify="center">
                                    <Col>
                                        <img src={`${this.state.repImageUrl}`} alt={`${this.state.repLastName} portrait`} className={styles.HeadShot} />
                                    </Col>
                                </Row>
                            </Col>
                            <Col xs={24} md={16} lg={18} xl={20}>
                                <Row className={styles.HeaderRow}>
                                    <Col span={24}>
                                        <Typography.Title level={4}>{yourLegislator}</Typography.Title>
                                    </Col>
                                </Row>
                                <Row className={styles.ContentRow}>
                                    <Col span={24}>
                                        <Typography.Title level={2}>{ title }</Typography.Title>
                                    </Col>
                                </Row>
                                <Row className={styles.HeaderRow}>
                                    <Col className={styles.Offices}>
                                        <Typography.Title level={4}>
                                            {offices.length > 1 ? "Offices:" : "Office:"}
                                        </Typography.Title>
                                    </Col>
                                </Row>
                                {/* Not using affix till I figure it out for desktop and mobile */}
                                {/* <Affix offsetTop={0} onChange={(affixed)=>{this.setState({officesLocked: affixed})}}> */}
                                    <Row className={styles.ContentRow} style={
                                        {borderBottom:  this.state.officesLocked ? "1px solid lightgrey" : "none" }
                                    }>
                                        <Col>
                                                <List
                                                    className={styles.Offices}
                                                    size="small"
                                                    itemLayout="horizontal"
                                                    dataSource={offices}
                                                    renderItem={item => (
                                                        <List.Item actions={[<a href={`tel:${item.phone}`}>{item.phone}</a>]}>
                                                            <List.Item.Meta title={<Typography.Text>{item.address.city} {item.address.state}</Typography.Text>}/>
                                                        </List.Item>
                                                    )}
                                                />
                                        </Col>
                                    </Row>
                                {/* </Affix> */}
                            </Col>
                        </Row>
                        </Col></Row>
                    </section>

                    <section id="instructions">
                        <Row type="flex" justify="center"><Col xs={24} md={20} lg={18} xl={12}>
                        <Collapse 
                            className={styles.WhatToExpect}
                            bordered={true}
                            accordion={true}
                            expandIconPosition="right"
                            expandIcon={({ isActive }) => <Icon type="info-circle" rotate={isActive ? 90 : 0} />}
                        >
                            <Collapse.Panel
                                header={<Typography.Text style={{ margin: 0}} strong>What To Expect</Typography.Text>}
                                key={1}
                            >
                                <Typography.Paragraph>Calling is simple, fast and non-threatening. You will either talk to a staff member (not {isSenatorDistrict(this.state) ? 'Senator' : 'Rep.'} {this.state.repLastName}) or you will get a recording. Staff will not quiz you.</Typography.Paragraph>
                                <Typography.Paragraph>They just want to know your name and address so they can confirm you live in {isSenatorDistrict(this.state) || isAtLargeDistrict(this.state) ? this.state.state : ` district ${this.state.number}`}. Then they will listen and make notes while you tell them your talking points. They will thank you, and you’re done. Simple as that.</Typography.Paragraph>
                            </Collapse.Panel>
                        </Collapse>
                        </Col></Row>
                    </section>

                    {/* This covid section can be removed when the US crisis has settled. */}
                    <section id="covid">
                        <Row type="flex" justify="center">
                            <Col xs={24} md={20} lg={18} xl={12}>
                            <Alert showIcon style={{ marginBottom: 20}} type="warning" message="Calling During the COVID Crisis" description="Many parts of the country are currently overwhelmed by this public health crisis. Please use your best judgement to decide whether the Member of Congress that represents your part of the country is receptive to our message during this sensitive time." />
                            </Col>
                        </Row>
                    </section>
                    {/* This covid section can be removed when the US crisis has settled. */}

                    <section id="talking-points">
                    <Row type="flex" justify="center" className={styles.HeaderRow}>
                        <Col xs={24} md={20} lg={18} xl={12}>
                        <Typography.Title level={2}>Call-In Script:</Typography.Title>
                    </Col>
                    </Row>
                    <Row type="flex" justify="center"><Col xs={24} md={20} lg={18} xl={12}>
                            {this.getIntroJSX()}
                            {this.getTalkingPointsJSX()}
                            {this.getRequestJSX()}
                            {this.getReportYourCallButtonJSX()}
                            </Col></Row>
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
            <Typography.Paragraph>Hello, my name is __________, and I live in  {isSenatorDistrict(this.state) || isAtLargeDistrict(this.state) ? this.state.state : ` district ${this.state.number}`}. I am calling about climate change.</Typography.Paragraph>
        </>
    }

    getTalkingPointsJSX = () => {
        const talkingPoints = (this.state.talkingPoints) ? this.state.talkingPoints.map((talkingPoint, idx) => {
            const education = (
                    <Typography.Paragraph>{talkingPoint.content}
                    {talkingPoint.referenceUrl && 
                        <span> (<a rel="noopener noreferrer" target="_blank" href={talkingPoint.referenceUrl}>Background Info</a>)</span>
                    }
                    </Typography.Paragraph>  
            );
            return (
            <Collapse.Panel header={<Typography.Text strong>{`${talkingPoint.theme}`}</Typography.Text>} key={idx}>
                    {education}
                </Collapse.Panel>);
        }) : null;
        return(
            <>
                <Typography.Title level={3}>Talking Point:</Typography.Title>
                <Typography.Text style={{fontStyle:"italic"}}>Talking points provide information that connects climate change to your local area. Choose one.</Typography.Text>
                <Row>
                    <Col span={24}>
                    <Collapse 
                        accordion
                        bordered={false}
                        onChange={(index)=> {
                            this.setState({
                                selectedTalkingPoint: index
                            })
                    }} >
                        { talkingPoints }
                    </Collapse>
                    </Col>
                </Row>
            </>
        )
    }

    getReportYourCallButtonJSX = () => {
        return (
            <>
                <Typography.Title level={3}>Report Your Call:</Typography.Title>
                <Button type="primary" className={styles.ICalled} onClick={this.handleICalled}>I called!</Button>
            </>
        );
    }

    getRequestJSX = () => {
        const sorted = [...this.state.requests].sort((el1, el2)=> {
            if (el1.lastModified < el2.lastModified) {
                return 1
            } else {
                return -1
            }
        });

        const request = sorted.shift();

        const subtitle = isSenatorDistrict(this.state) ? 
        `A specific request for Senator ${this.state.repLastName}:` :
        `A specific request for Rep. ${this.state.repLastName}:`;

        return request ? (
            <>
                <Typography.Title style={{marginTop: "1em"}}level={3}>Request:</Typography.Title>
                <Typography.Text style={{fontStyle:"italic"}}>{subtitle}</Typography.Text>
                {this.state.requests[0] && 
                    <Typography.Paragraph>{request.content}</Typography.Paragraph>
                }
            </>
        ) : null;
        
    }
}

export default CallIn;
