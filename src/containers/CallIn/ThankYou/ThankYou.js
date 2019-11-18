import React, { Component } from 'react';
import { Card, Col, Divider, Icon, message, Row, Skeleton, Statistic, Typography } from 'antd';
import { Redirect } from 'react-router-dom';

import SimpleLayout from '../../Layout/SimpleLayout/SimpleLayout';
import axios from '../../../util/axios-api';
import {isSenatorDistrict} from '../../../util/district';

import styles from './ThankYou.module.css';

import capitol from '../../../assets/images/capitol-group.jpg';
import discussion from '../../../assets/images/discussion.jpeg';
import grassroots from '../../../assets/images/grassroots.jpg';

class ThankYou extends Component {

    state = {
        district: null,
        localStats: null,
        overallStats: null,
        statsError: null,
        signUpRedirect: false
    }

    componentDidMount = () => {
        const urlParams = new URLSearchParams(this.props.location.search.slice(1));
        const state = urlParams.get('state') && urlParams.get('state').toUpperCase();
        const number = urlParams.get('district');
        this.fetchStats(state, number);
        this.removeTrackingGetArgs();
        this.setState({
            state: state || '',
            district: number
        });
    }

    fetchStats = (state, number) => {
        if (!state || !number) {
            this.setState({
                statsError: Error("No district specified")
            })
            return;
        }

        axios.get('districts').then((response)=>{
            const districts = response.data;
            const foundDistrict = districts.find((el)=>{
                return (state.toLowerCase() === el.state.toLowerCase()) && (parseInt(number) === parseInt(el.number))
            })
            if(!foundDistrict && !foundDistrict.districtId){
                this.setState({
                    statsError: Error("No district found")
                })
                return;
            }

            Promise.all(
                [
                    axios.get(`stats/${foundDistrict.districtId}`), 
                    axios.get(`stats`)
                ])
                .then(values => {
                    const district = values[0].data
                    const overall = values[1].data
                    this.setState({
                        localStats: district,
                        overallStats: overall,
                        district: foundDistrict
                    })
                }).catch((error) => {
                    this.setState({
                        statsError: error
                    })
                });
        });
    }

    handleShare = (platform) => {
        switch (platform) {
            case 'facebook':
                this.openInNewTab('https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.projectgrandcanyon.com')
                break;
            case 'twitter':
                this.openInNewTab('https://twitter.com/intent/tweet?text=Check+out+www.projectgrandcanyon.com.+It%27s+a+great+way+for+individuals+to+make+a+difference+on+climate+change.')
                break;
            default:
                this.copyToClipboard('https://www.projectgrandcanyon.com')
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
        const urlParams = new URLSearchParams(this.props.location.search.slice(1));
        urlParams.delete('t');
        this.props.history.push({
            pathname: this.props.history.location.pathname,
            search: `${urlParams.toString()}`,
            state: {...this.state}
          })
    }

    getStatsJSX = () => {
        if (this.state.statsError) {
            return null;
        }
        if (!this.state.localStats || !this.state.district || !this.state.overallStats) {
            return <Skeleton />;
        }
        if (this.state.district && !this.state.district.repLastName) {
            return null;
        }

        const localCalls = this.state.localStats && this.state.localStats.totalCalls;
        const localCallers = this.state.localStats && this.state.localStats.totalCallers;
        const overallCalls = this.state.overallStats && this.state.overallStats.totalCalls;
        const overallCallers = this.state.overallStats && this.state.overallStats.totalCallers;
        const isSen = isSenatorDistrict(this.state.district);
        const repName = isSen ? `Senator ${this.state.district.repLastName}` : `Rep. ${this.state.district.repLastName}`;

        const overallCallsCol = (<Col xs={24} sm={12} md={6} className={styles.StatCol}>
            <Card style={{height:"100%"}}><Statistic title="Total Calls Nationwide" value={overallCalls} suffix={<Icon type="phone" />} /></Card>
        </Col>);
        const localCallsCol = (<Col xs={24} sm={12} md={6} className={styles.StatCol}>
            <Card style={{height:"100%"}}><Statistic title={`Total Calls to ${repName}`} value={localCalls} suffix={<Icon type="phone" />} /></Card>
        </Col>);
        const overallCallersCol = (<Col xs={24} sm={isSen ? 24 : 12} md={isSen ? 12 : 6} className={styles.StatCol}>
            <Card style={{height:"100%"}}><Statistic title="Registered Callers Nationwide" value={overallCallers} suffix={<Icon type="phone" />} /></Card>
        </Col>);
        const localCallersCol = (<Col xs={24} sm={12} md={6} className={styles.StatCol}>
            <Card style={{height:"100%"}}><Statistic title={`People calling ${repName}`} value={localCallers} suffix={<Icon type="phone" />} /></Card>
        </Col>);

        const senCallers = overallCallersCol;
        const repCallers = (
            <>
            {overallCallersCol}
            {localCallersCol}
            </>
        )

        return (
            <>
                <Row className={styles.Heading}>
                    <Typography.Title level={4} style={{fontStyle: 'italic'}}>Our Impact So Far:</Typography.Title>
                </Row>
                <div style={{ background: '#ECECEC', padding: '30px' }}>
                <Row type="flex" justify="center" align="middle">
                    {localCallsCol}
                    {overallCallsCol}
                </Row>
                <Row type="flex" justify="center" align="middle">
                { isSen ? senCallers : repCallers}
                </Row>
                </div>
                <Divider />
            </>
        );        
    }

    render() {
        
        if (this.state.signUpRedirect) {
            return <Redirect to="/signup" />
        }

        const pitch = this.state.stats ? "Please help us make a bigger impact:" : "Here's how you can do a little more:";

        return (
            <SimpleLayout activeLinkKey="/signup">
                <div className={styles.ThankYou}>
                    <div className={styles.Heading}>
                        <Typography.Title level={2}>Thank You for Calling</Typography.Title>
                    </div>
                    { this.getStatsJSX() }
                    <div className={styles.Heading}>
                        <Typography.Title level={4} style={{fontStyle: 'italic'}}>{pitch}</Typography.Title>
                    </div>
                    <Row type="flex" gutter={4}>
                        {
                            !this.state.identifier && (<Col xs={24} sm={12} md={12} lg={12} xl={8}>
                                <Card
                                    cover={<img alt="US Captitol Building" src={capitol} />}
                                    actions={[<Icon type="user-add" onClick={()=>{this.setState({signUpRedirect: true})}} />]}
                                >
                                    <Card.Meta
                                    title="Sign Up for Call Reminders"
                                    description="If you haven't done it already, sign up to get a monthly call reminder from Project Grand Canyon."
                                    />
                                </Card>
                            </Col>)
                        }
                        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                            <Card
                                cover={<img alt="US Captitol Building" src={discussion} />}
                                actions={[<Icon type="facebook" onClick={()=>{this.handleShare('facebook')}} />, <Icon type="twitter" onClick={()=>{this.handleShare('twitter')}} />, <Icon type="mail" onClick={()=>{this.handleShare('email')}} />]}
                            >
                                <Card.Meta
                                title="Share Project Grand Canyon"
                                description="The more people who call, the more Members of Congress will listen. Spread the word on social media."
                                />
                            </Card>
                        </Col>
                        <Col xs={24} sm={12} md={12} lg={12} xl={8}>
                            <Card
                                cover={<img alt="Volunteer with clipboard" src={grassroots} />}
                                actions={[<Icon type="user-add" onClick={()=>{this.openInNewTab('https://citizensclimatelobby.org/join-citizens-climate-lobby/')}}/>]}
                            >
                                <Card.Meta
                                title="Join Citizens' Climate Lobby"
                                description="CCL volunteers created this site, and we would love for you to join us."
                                />
                            </Card>
                        </Col>
                    </Row>
                </div>
            </SimpleLayout>
        )
    }
}

export default ThankYou;
