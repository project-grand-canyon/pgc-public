import React, { Component } from 'react';

import { Button, Col, Collapse, Empty, Icon, List, Row, Spin, Tooltip, Typography } from 'antd';

import { Link, Redirect } from 'react-router-dom';
import { connect } from "react-redux";

import styled from '@emotion/styled'


import axios_api from '../../util/axios-api';
import { isSenatorDistrict, isAtLargeDistrict, displayName } from '../../util/district';
import SimpleLayout from '../Layout/SimpleLayout/SimpleLayout';
import InfoPanel from './InfoPanel';

import { logNotification } from "../../redux/actions";

import styles from './CallIn.module.css';
import getUrlParameter from '../../util/urlparams';
import gavelImage from '../../assets/images/gavel.png';


const InfoBlurb = styled.div`
    background: ${props => props.bg};
    padding: 0.5rem 0;
    margin-bottom: 1rem;
`

export class CallIn extends Component {

    state = {
        repLastName: null,
        repFirstName: null,
        repImageUrl: null,
        state: null,
        number: null,
        districtId: null,
        status: null,
        offices: null,
        fetchCallInError: null,
        identifier: null,
        didCall: false,
        callerId: null,
        officesLocked: false,
        homeDistrict: null,
        tracked: false, // whether the call was successfully tracked
        skipReport: false
    }

    removeGetArgs = () => {
        this.props.history.push({
            pathname: this.props.history.location.pathname,
            search: '',
            state: { ...this.state }
        })
    }


    fetchCongressionalDistricts = () => {
        const pathComponents = this.props.history.location.pathname.split('/');
        const state = pathComponents[2]
        const number = pathComponents[3]
        if (!state || !number) {
            this.setState({
                fetchCallInError: "No district specified"
            })
        }
        axios_api.get('districts').then((response) => {
            const districts = response.data;
            const foundDistrict = districts.find((el) => {
                return (state.toLowerCase() === el.state.toLowerCase()) && (parseInt(number) === parseInt(el.number))
            })
            if (!foundDistrict) {
                throw Error(`No call-in details found for ${state}-${number}`)
            }
             axios_api.get(`districts/${foundDistrict.districtId}/hydrated`)
                .then(resp => {
                    const hydrated = resp.data
                    this.setState({
                        repLastName: hydrated.repLastName,
                        repFirstName: hydrated.repFirstName,
                        repImageUrl: hydrated.repImageUrl,
                        requests: hydrated.requests,
                        state: hydrated.state,
                        number: hydrated.number,
                        offices: hydrated.offices,
                        districtId: hydrated.districtId,
                        status: hydrated.status,
                    })
                }).catch(e => {
                    throw e
                });
        }).catch(e => {
            this.setState({
                fetchCallInError: e
            })
        })
    }

    componentDidMount() {
        const params = this.props.history.location.search
        const homeDistrict = getUrlParameter(params, 'd');
        const identifier = getUrlParameter(params, 't');
        const caller = getUrlParameter(params, 'c');
        this.props.logNotification(caller, identifier, homeDistrict);
        this.setState({
            homeDistrict: homeDistrict,
            identifier: identifier,
            callerId: caller
        }, () => {
            this.fetchCongressionalDistricts();
        });
        this.removeGetArgs();
    }

    render() {
        if (this.state.didCall) {
            let search = `?state=${this.state.state}&district=${this.state.number}`

            const notificationExpiry = Date.now() - (1000 * 60 * 10) // 10 minutes in milliseconds
            const isLiveNotification = this.props.notification && this.props.notification.timestamp > notificationExpiry

            const identifier = this.state.identifier || (isLiveNotification && this.props.notification.trackingId)
            if (identifier) {
                search += `&t=${identifier}`
            }
            const homeDistrict = this.state.homeDistrict || (isLiveNotification && this.props.notification.homeDistrict)
            if (homeDistrict) {
                search += `&d=${homeDistrict}`
            }
            const callerId = this.state.callerId || (isLiveNotification && this.props.notification.callerId)
            if (callerId) {
                search += `&c=${callerId}`
            }
            if (this.state.skipReport) {
                search += `&s=1`
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
                {this.state.fetchCallInError ? this.getErrorJSX() : this.getCallInJSX()}
            </SimpleLayout>
        );
    }

    getErrorJSX = () => {
        const error = (
            <Empty style={{ marginTop: '20px', marginBottom: '20px' }} description="There was an error fetching the call-in information. Please try again later." />
        );
        return error;
    }

    getCallInJSX = () => {
        const offices = this.state.offices;
        const yourLegislator = isSenatorDistrict(this.state) ? "Your Senator:" : " Your Representative:";
        const title = isSenatorDistrict(this.state) ?
            `${this.state.repFirstName} ${this.state.repLastName} (${displayName(this.state)})` :
            `${this.state.repFirstName} ${this.state.repLastName} (${displayName(this.state)})`;

        if (!this.state.repLastName) {
            return (
                <div className={styles.Loading}>
                    <Spin />
                </div>
            )
        }

        return (
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
                                        <Typography.Title level={2}>{title}</Typography.Title>
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
                                    { borderBottom: this.state.officesLocked ? "1px solid lightgrey" : "none" }
                                }>
                                    <Col>
                                        <List
                                            className={styles.Offices}
                                            size="small"
                                            itemLayout="horizontal"
                                            dataSource={offices}
                                            renderItem={item => (
                                                <List.Item actions={[<a href={`tel:${item.phone}`}>{item.phone}</a>]}>
                                                    <List.Item.Meta title={<Typography.Text>{item.address.city} {item.address.state}</Typography.Text>} />
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
                    <Row type="flex" justify="center">
                        <Col xs={24} md={20} lg={18} xl={12}>
                            <Collapse
                                className={styles.WhatToExpect}
                                bordered={true}
                                accordion={true}
                                expandIconPosition="right"
                                expandIcon={({ isActive }) => <Icon type="info-circle" rotate={isActive ? 90 : 0} />}
                            >
                                <Collapse.Panel
                                    header={<Typography.Text style={{ margin: 0 }} strong>What To Expect</Typography.Text>}
                                    key={1}
                                >
                                    <Typography.Paragraph>Calling is simple, fast and non-threatening. You will either talk to a staff member (not {isSenatorDistrict(this.state) ? 'Senator' : 'Rep.'} {this.state.repLastName}) or you will get a recording. Staff will not quiz you.</Typography.Paragraph>
                                    <Typography.Paragraph>They just want to know your name and address so they can confirm you live in {isSenatorDistrict(this.state) || isAtLargeDistrict(this.state) ? this.state.state : ` district ${this.state.number}`}. Then they will listen and make notes while you tell them your request. They will thank you, and you’re done. Simple as that.</Typography.Paragraph>
                                </Collapse.Panel>
                            </Collapse>
                        </Col>
                    </Row>
                </section>

                <section id="Script">
                    <Row type="flex" justify="center" className={styles.HeaderRow}>
                        <Col xs={24} md={20} lg={18} xl={12}>
                            <Typography.Title level={2}>Call-In Script:</Typography.Title>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col xs={24} md={20} lg={18} xl={12}>
                            {this.getIntroJSX()}
                            {this.getRequestJSX()}
                        </Col>
                    </Row>
                </section>
                <section id="Report">
                    <Row type="flex" justify="center" className={styles.HeaderRow}>
                        <Col xs={24} md={20} lg={18} xl={12}>
                            <Typography.Title level={2}>After Your Call:</Typography.Title>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center">
                        <Col xs={24} md={20} lg={18} xl={12}>
                            <Button type="primary" size="large" className={styles.ICalled} onClick={(e) => this.advance(false)}>Report Your Call <span role="img" aria-label="jsx-a11y/accessible-emoji">&nbsp;☎️</span></Button>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center" className={styles.topSpacing}>
                        <Col xs={24} md={20} lg={18} xl={12}>
                            <Typography.Text><Button type="link" onClick={(e) => this.advance(true)}>Skip this call</Button> <Tooltip position="top" title="Use this to advance to the next page when the voice mail is full, you've already called this particular person this month, or similar situations."><Icon type="question-circle" /></Tooltip></Typography.Text>
                        </Col>
                    </Row>
                </section>
                <section id={styles.info}>
                    <Row type="flex" justify="center">
                        <Col  xs={24} md={20} lg={18} xl={12}>
                            <InfoPanel 
                            title="Why call?" 
                            subtitle="Advocate for Carbon Pricing" 
                            blurb="Citizens' Climate Lobby and its 200,000+ volunteers support carbon pricing legislation as a key tool for slowing climate change."
                            ctaText="Read our carbon pricing explainer page"
                            ctaURL="https://citizensclimatelobby.org/carbon-pricing-congress/"
                            image={gavelImage} 
                            />
                        </Col>
                    </Row>
                </section>
                {
                    this.state.callerId && this.state.identifier ? (
                        <section id="settings">
                             <Row type="flex" justify="center" className={styles.HeaderRow}>
                        <Col xs={24} md={20} lg={18} xl={12}>
                        <Typography.Title level={3}>Update your notification preferences</Typography.Title>
                            <Typography.Paragraph>To update your notification preferences, visit the <Link to={{pathname: "/my_settings", search: `?c=${this.state.callerId}&t=${this.state.identifier}`}}>settings page</Link>.</Typography.Paragraph>
                        </Col>
                    </Row> 
                    </section>
                    ) : null
                }
                
            </div>
        );
    }

    getIntroJSX = () => {
        return <>
            <Typography.Title level={3}>Introduction:</Typography.Title>
            <Typography.Paragraph>Hello, my name is __________, and I live in  {isSenatorDistrict(this.state) || isAtLargeDistrict(this.state) ? this.state.state : ` district ${this.state.number}`}. I am calling about climate change.</Typography.Paragraph>
        </>
    }

    advance = (skipReport = false) => {
        this.setState({
            didCall: true,
            skipReport
        })
    }

    getRequestJSX = () => {
        const sorted = [...this.state.requests].sort((el1, el2) => {
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
                <Typography.Title style={{ marginTop: "1em" }} level={3}>Request:</Typography.Title>
                <Typography.Text style={{ fontStyle: "italic" }}>{subtitle}</Typography.Text>
                {this.state.requests[0] &&
                    <Typography.Paragraph>{request.content}</Typography.Paragraph>
                }
                <InfoBlurb bg="transparent"><Typography.Text > <Icon type="info-circle" /> Learn more about the bills we support on our <a target="_blank" rel="noopener noreferrer" href="https://community.citizensclimate.org/resources/item/19/240">supporting asks page</a>.</Typography.Text></InfoBlurb>
            </>
        ) : null;

    }
}

const mapStateToProps = state => {
    const { notification } = state;
    return { notification };
};

export default connect(mapStateToProps, { logNotification })(CallIn);
