import React, { Component } from 'react';
import { Button, Card, Col, Icon, message, Modal, Row, Typography } from 'antd';
import { Redirect } from 'react-router-dom';
import styled from '@emotion/styled'
import { connect } from "react-redux";

import SimpleLayout from '../../Layout/SimpleLayout/SimpleLayout';
import axios from '../../../util/axios-api';
import getUrlParameter from '../../../util/urlparams';

import capitol from '../../../assets/images/capitol-group.jpg';
import discussion from '../../../assets/images/discussion.jpeg';
import grassroots from '../../../assets/images/grassroots.jpg';
import OtherCallTargets from './OtherCallTargets';
import CallStats from './CallStats/CallStats'

import { logCall as logCallAmplitude } from "../../../util/amplitude";
import { logCall } from "../../../redux/actions";
import axios_api from "../../../util/axios-api";
import { findDistrictByStateNumber } from "../../../util/district";

import * as Sentry from "@sentry/browser";


const CONTENT_WIDTH_PX = 900
const StyledRow = styled(Row)`
    background: ${props => props.bg};
    padding: 1.4em;

    @media (min-width: ${CONTENT_WIDTH_PX + 20}px) {
        padding: 2em calc(50vw - ${CONTENT_WIDTH_PX / 2}px);
    }
`
const ColorContentRow = ({ bg, children }) => (
    <StyledRow
        bg={bg || 'transparent'}
        type="flex"
        justify="center"
        gutter={[20, 20]}
    >
        {children}
    </StyledRow>
)

export class ThankYou extends Component {

    state = {
        district: null,
        callerId: null,
        homeDistrictNumber: null,
        trackingToken: null,
        eligibleCallTargets: [],
        callWasTracked: false,
        callWasReported: false,
        localStats: null,
        ignoreCall: false,
        overallStats: null,
        signUpRedirect: false
    }

    componentDidMount = () => {
        const params = this.props.location.search;
        const calledNumber = getUrlParameter(params, 'district') || undefined;
        const calledState = getUrlParameter(params, 'state') || undefined;
        const homeDistrictNumber = getUrlParameter(params, 'd') || undefined;
        const trackingToken = getUrlParameter(params, 't') || undefined;
        const callerId = getUrlParameter(params, 'c') || undefined;
        const ignoreCall = getUrlParameter(params, 's') === "1";

        const missingParams = [
            ['district', calledNumber],
            ['state', calledState],
            ['d', homeDistrictNumber],
            ['t', trackingToken],
            ['c', callerId]
        ]
        .filter(p=> !p[1])
        .map(p=>p[0])
        .join()
        if (missingParams !== '') {
            Sentry.addBreadcrumb({
                category: "Call In Thank You",
                message: "missing parameters: " + missingParams,
                level: Sentry.Severity.Warning,
            });
        }
        else {
            Sentry.addBreadcrumb({
                category: "Call In Thank You",
                message: "all url parameters provided",
                level: Sentry.Severity.Info,
            });
        }
        this.removeTrackingGetArgs();
        this.fetchDistricts((districts) => {
            const calledDistrict = findDistrictByStateNumber(calledState, calledNumber, districts);
            if (!calledDistrict || !calledDistrict.districtId) {
                const msg = "No district found with state = " + calledState + " and number = " + calledNumber;
                Sentry.addBreadcrumb({
                    category: "Call In Thank You",
                    message: msg,
                    level: Sentry.Severity.Warning,
                });
                return;
            } else {
                const eligibleCallTargets = this.eligibleCallTargetDistrictIds(
                    homeDistrictNumber,
                    calledState,
                    calledNumber,
                    districts
                );
                this.setState({
                    district: calledDistrict,
                    callerId,
                    homeDistrictNumber,
                    ignoreCall,
                    trackingToken,
                    eligibleCallTargets: eligibleCallTargets.length ? eligibleCallTargets : null,
                });
                if (!this.callWasReported) {
                    this.reportCall(trackingToken, callerId, calledDistrict, ignoreCall);
                }
                this.setStats(calledDistrict);
            }
        });
    }
    reportCall = (trackingToken, callerId, calledDistrict, ignoreCall = false) => {
        
        if (ignoreCall) {
            return;
        }
        
        if (!trackingToken || !callerId) {
            if (!trackingToken) {
                //Send Sentry Breadcrumb
                Sentry.addBreadcrumb({
                    category: "Missing Thank You Arguments",
                    message: "Thank you page accessed without tracking token argument",
                    level: Sentry.Severity.Info,
                });
            }
            if (!callerId) {
                //Send Sentry Breadcrumb
                Sentry.addBreadcrumb({
                    category: "Missing Thank You Arguments",
                    message: "Thank you page accessed without caller id argument",
                    level: Sentry.Severity.Info,
                });
            }
        }
        const reportBody = (trackingToken && callerId) ? {
            callerId: parseInt(callerId),
            trackingId: trackingToken,
            districtId: calledDistrict.districtId,
        } : {};
        this.props.logCall(calledDistrict.districtId);
        logCallAmplitude({
            state: calledDistrict.state,
            number: calledDistrict.number
        });
        axios_api.post('calls', reportBody).then((response) => {
            this.setState({
                callWasReported: true,
                callWasTracked: true
            });
        }).catch((error) => {
            this.setState({
                callWasReported: true,
                callWasTracked: false
            });

            Modal.error({
                title: <Typography.Title level={2}>Your call was not tracked by CCL</Typography.Title>,
                content: (
                    <>
                        <Typography.Title level={3}>If you want credit for this call:</Typography.Title>
                        <Typography.Title level={4}><span role="img" aria-label="smartphone">📱</span> Text Message Subscribers:</Typography.Title>
                        <Typography.Text>
                            Open the link in the most recent text message and click the "Report your call" button from that page.
                        </Typography.Text>
                        <Typography.Title level={4}><span role="img" aria-label="envelope">✉️</span> Email Subscribers:</Typography.Title>
                        <Typography.Text>
                            Find the most recent email from MCC and click the "Report your call" button from that email.
                        </Typography.Text>
                    </>
                  )
              });

        });
    }

    eligibleCallTargetDistrictIds = (homeDistrictNumber, calledState, calledNumber, districts) => {
        const callExpiry = Date.now() - (1000 * 60 * 60) // 1 hour in milliseconds
        if (!homeDistrictNumber) {
            Sentry.addBreadcrumb({
                category: "Missing Thank You Arguments",
                message: "Thank you page accessed without caller district argument",
                level: Sentry.Severity.Info,
              });
        }
        const eligibleDistricts = homeDistrictNumber !== undefined ? [-1, -2, parseInt(homeDistrictNumber)] : [-1, -2]
            return eligibleDistricts.filter(el => {
                return `${el}` !== `${calledNumber}`
            })
            .map(districtNumber => {
                return findDistrictByStateNumber(calledState, districtNumber, districts)
            })
            // Filter out the `covid_paused` districts
            .filter(district => district && district.status === 'active')
            .map(district => {
                const hasMadeCalls = this.props.calls && this.props.calls.byId
                if (!hasMadeCalls) {
                    return district
                }
                const hasCalledThisDistrict = Object.entries(this.props.calls.byId).find((entry) => {
                    const [districtId, timestamp] = entry
                    return districtId === `${district.districtId}` && timestamp > callExpiry
                })
                district['alreadyCalled'] = hasCalledThisDistrict
                return district
            })
    }

    fetchDistricts = (cb) => {
        axios.get('districts').then((response) => {
            const districts = response.data;
            cb(districts)
        });
    }

    setStats = (district) => {
        Promise.all(
            [
                axios.get(`stats/${district.districtId}`),
                axios.get(`stats`)
            ])
            .then(values => {
                const district = values[0].data
                const overall = values[1].data
                this.setState({
                    localStats: district,
                    overallStats: overall
                })
            }).catch((error) => {
                Sentry.captureException(error);
            });
    }

    handleShare = (platform) => {
        switch (platform) {
            case 'facebook':
                this.openInNewTab('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fcitizensclimatelobby.org/monthly-calling-campaign')
                break;
            case 'twitter':
                this.openInNewTab('https://twitter.com/intent/tweet?text=Check+out+citizensclimatelobby.org/monthly-calling-campaign.+It%27s+a+great+way+for+individuals+to+make+a+difference+on+climate+change.')
                break;
            default:
                this.copyToClipboard('https://citizensclimatelobby.org/monthly-calling-campaign')
                message.success('A shareable link has been copied to your clipboard.')
                break;
        }
    }

    copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };

    openInNewTab = (url) => {
        var win = window.open(url, '_blank');
        win.focus();
    }

    removeTrackingGetArgs = () => {
        try {
            const urlParams = new URLSearchParams(this.props.location.search.slice(1));
            urlParams.delete('t');
            urlParams.delete('d');
            urlParams.delete('c');
            urlParams.delete('s')
            this.props.history.push({
                pathname: this.props.history.location.pathname,
                search: `${urlParams.toString()}`,
                state: { ...this.state }
            })
        } catch (error) {
            console.error(error);
        }

    }

    alreadyCalledDistricts = () => {
        if (this.props.calls && this.props.calls.byId) {
            return this.props.calls.byId.map((el) => {
                return el.district
            })
        } else {
            return []
        }
    }

    render() {
        if (this.state.signUpRedirect) {
            return <Redirect to="/signup" />
        }
        return (
            <SimpleLayout activeLinkKey="/signup">
                <ColorContentRow bg="#ececec">
                    <Col xs={24} align="center">
                        <Typography.Title level={1}>Thank You for {this.state.ignoreCall ? "Participating" : "Calling"}</Typography.Title>
                        {
                            this.state.callWasTracked ?
                                (<Typography.Text>Your call was added to our count! CCL members, your call was also added to the CCL Action Tracker.</Typography.Text>) : null
                        }
                        {
                            this.state.ignoreCall ?
                            (<Typography.Text>How about calling your other Members of Congress?</Typography.Text>) : null
                        }
                    </Col>
                    {this.state.district && this.state.localStats && (
                        <Col sm={24} md={12} lg={14}>
                            <CallStats
                                district={this.state.district}
                                localStats={this.state.localStats}
                                overallStats={this.state.overallStats}
                            />
                        </Col>
                    )}
                    {this.state.eligibleCallTargets && (
                        <Col sm={24} md={12} lg={10}>
                            <OtherCallTargets
                                homeDistrictNumber={this.state.homeDistrictNumber}
                                callerId={this.state.callerId}
                                trackingToken={this.state.trackingToken}
                                districts={this.state.eligibleCallTargets}
                            />
                        </Col>
                    )}
                </ColorContentRow>
                <ColorContentRow>
                    <Col xs={24} align="center">
                        <Typography.Title level={3}>More Ways To Help</Typography.Title>
                    </Col>
                    <Col xs={24} md={8} lg={6}>
                        <Card
                            cover={<img alt="US Capitol Building" src={capitol} />}
                        >
                            <Typography.Paragraph>
                                We need to double the number of calls we make to Congress every month and you can help.
                            </Typography.Paragraph>
                            <Typography.Paragraph>
                                Do you know someone in the USA who might like to join our Monthly Calling Campaign? If so, send them the link and ask them to sign up today.
                            </Typography.Paragraph>
                            <Button
                                onClick={() => { this.handleShare('copyToClipboard') }}
                            >
                                <Icon type="copy" /> Copy link
                            </Button>
                        </Card>
                    </Col>
                    <Col xs={24} md={8} lg={6}>
                        <Card
                            cover={<img alt="People talking" src={discussion} />}
                            actions={[
                                <Icon type="facebook" onClick={() => { this.handleShare('facebook') }} />,
                                <Icon type="twitter" onClick={() => { this.handleShare('twitter') }} />
                            ]}
                        >
                            <Typography.Paragraph>
                                Share an easy way to help the climate with your friends and family.
                            </Typography.Paragraph>
                            <Typography.Paragraph>
                                Post the Monthly Calling Campaign on social media!
                            </Typography.Paragraph>
                        </Card>
                    </Col>
                    <Col xs={24} md={8} lg={6}>
                        <Card
                            cover={<img alt="Volunteer with clipboard" src={grassroots} />}
                        >
                            <Typography.Paragraph>
                                Citizens' Climate Lobby's consistently respectful, nonpartisan approach to climate education is designed to create a broad, sustainable foundation for climate action.
                            </Typography.Paragraph>
                            <Typography.Paragraph>
                                Learn more about CCL and what we do.
                            </Typography.Paragraph>
                            <Button
                                onClick={() => { this.openInNewTab('https://citizensclimatelobby.org/join-citizens-climate-lobby/') }}
                            >
                                <Icon type="team" /> Visit CCL
                            </Button>
                        </Card>
                    </Col>
                </ColorContentRow>
            </SimpleLayout>
        )
    }
}

const mapStateToProps = state => {
    const { calls } = state;
    return { calls };
};

export default connect(mapStateToProps, { logCall })(ThankYou);