import React, { Component } from 'react';
import { Card, Col, Divider, Icon, message, Row, Skeleton, Statistic, Typography } from 'antd';
import { Redirect } from 'react-router-dom';

import SimpleLayout from '../../Layout/SimpleLayout/SimpleLayout';
import axios from '../../../util/axios-api';
import getUrlParameter from '../../../util/urlparams';
import {isSenatorDistrict} from '../../../util/district';

import styles from './ThankYou.module.css';

import capitol from '../../../assets/images/capitol-group.jpg';
import discussion from '../../../assets/images/discussion.jpeg';
import grassroots from '../../../assets/images/grassroots.jpg';

class ThankYou extends Component {

    state = {
        eligibleCallTargets: null,
        district: null,
        localStats: null,
        overallStats: null,
        statsError: null,
        signUpRedirect: false
    }

    componentDidMount = () => {
        const params = this.props.location.search;
        const calledState = getUrlParameter(params, 'state') && getUrlParameter(params, 'state').toUpperCase();
        const calledNumber = getUrlParameter(params, 'district');
        const homeDistrictNumber = getUrlParameter(params, 'd') || undefined;
        this.removeTrackingGetArgs();
        this.fetchDistricts((districts) => {
            const calledDistrict = this.findDistrictByStateNumber(calledState, calledNumber, districts);
            if(!calledDistrict && !calledDistrict.districtId){
                this.setState({
                    statsError: Error("No district found")
                })
                return;
            } else {
                this.setStats(calledDistrict);
                const eligibleCallTargets = this.eligibleCallTargetDistrictIds(homeDistrictNumber, calledNumber).map( districtNumber => {
                    return this.findDistrictByStateNumber(calledState, districtNumber, districts);
                });
                this.setState({
                    district: calledDistrict,
                    eligibleCallTargets: eligibleCallTargets                    
                })
            }
        })
    }

    eligibleCallTargetDistrictIds = (homeDistrict, justCalled) => {
        return [-1, -2, homeDistrict].filter(el => {
            return `${el}` !== `${justCalled}`
        });
    }

    fetchDistricts = (cb) => {
        axios.get('districts').then((response)=>{
            const districts = response.data;
            cb(districts)
        });
    }

    findDistrictByStateNumber = (state, number, districts) => {
        return districts.find((el)=>{
            return (state.toLowerCase() === el.state.toLowerCase()) && (parseInt(number) === parseInt(el.number))
        })
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
                this.setState({
                    statsError: error
                })
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
            this.props.history.push({
                pathname: this.props.history.location.pathname,
                search: `${urlParams.toString()}`,
                state: {...this.state}
            })
        } catch(error) {
            console.error(error);
        }
        
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
            <Card style={{height:"100%"}}><Statistic title={<Typography.Text style={{fontSize: "1.2em"}}>Total Calls Nationwide</Typography.Text>} value={overallCalls} suffix={<Icon type="phone" />} /></Card>
        </Col>);
        const localCallsCol = (<Col xs={24} sm={12} md={6} className={styles.StatCol}>
            <Card style={{height:"100%"}}><Statistic title={<Typography.Text style={{fontSize: "1.2em"}}>{`Total Calls to ${repName}`}</Typography.Text>} value={localCalls} suffix={<Icon type="phone" />} /></Card>
        </Col>);
        const localCallersCol = (<Col xs={24} sm={12} md={6} className={styles.StatCol}>
            <Card style={{height:"100%"}}><Statistic title={<Typography.Text style={{fontSize: "1.2em"}}>{`People signed up to call ${repName}`}</Typography.Text>} value={localCallers} suffix={<Icon type="smile" />} /></Card>
        </Col>);
        const overallCallersCol = (<Col xs={24} sm={isSen ? 24 : 12} md={isSen ? 12 : 6} className={styles.StatCol}>
            <Card style={{height:"100%"}}><Statistic title={<Typography.Text style={{fontSize: "1.2em"}}>Registered Callers Nationwide</Typography.Text>} value={overallCallers} suffix={<Icon type="smile" />} /></Card>
        </Col>);

        const senCallers = overallCallersCol;
        const repCallers = (
            <>
            {localCallersCol}
            {overallCallersCol}
            </>
        )

        return (
            <>
                <div style={{ background: '#ECECEC', padding: '20px', display: localCalls > 0 ? 'block' : 'none' }}>
                    <Row className={styles.Heading}>
                        <Typography.Title level={3}>Our Impact So Far:</Typography.Title>
                    </Row>
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

    getOtherCallTargetCards = () => {
        return this.state.eligibleCallTargets && this.state.eligibleCallTargets.filter(el=>{return el !== undefined && el !== null}).map(el => {
            return (
                <Col xs={24} sm={12} md={12} lg={12} xl={8} key={el.districtId}>
                    <Card
                        cover={<img alt="representative portrait" src={el.repImageUrl} />}
                        actions={[<Icon type="phone" onClick={()=>{this.openInNewTab(`https://cclcalls.org/call/${el.state}/${el.number}`)}}/>]}
                    >
                        <Card.Meta
                        title={`Call ${isSenatorDistrict(el) ? "Senator" : "Representative"} ${el.repLastName}`}
                        description={`Itching to call more people? Give ${isSenatorDistrict(el) ? "Senator" : "Representative"} ${el.repLastName} a ring.`}
                        />
                    </Card>
                </Col>
            )
        })
    }

    render() {
        
        if (this.state.signUpRedirect) {
            return <Redirect to="/signup" />
        }

        const pitch = this.state.localStats ? "Please help us make a bigger impact:" : "Here's how you can do a little more:";

        return (
            <SimpleLayout activeLinkKey="/signup">
                <Row type="flex" justify="center">
                    <Col xs={24} md={20} lg={18} xl={16}>
                        <div className={styles.ThankYou}>
                    <div className={styles.Heading}>
                        <Typography.Title level={1}>Thank You for Calling</Typography.Title>
                    </div>
                    { this.getStatsJSX() }
                    <div className={styles.Heading}>
                        <Typography.Title level={3}>{pitch}</Typography.Title>
                    </div>
                    <Row type="flex" gutter={[4, 4]}>
                        {this.getOtherCallTargetCards()}
                        {
                            !this.state.identifier && (<Col xs={24} sm={12} md={12} lg={12} xl={8}>
                                <Card
                                    cover={<img alt="US Captitol Building" src={capitol} />}
                                    actions={[<Icon type="user-add" onClick={()=>{this.setState({signUpRedirect: true})}} />]}
                                >
                                    <Card.Meta
                                    title="Sign Up for Call Reminders"
                                    description="If you haven't done it already, sign up to get a monthly call reminder."
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
                                title="Share the Calling Congress Campaign"
                                description="The more people who call, the more our representatives listen. Spread the word."
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
                    </Col>
                </Row>
            </SimpleLayout>
        )
    }
}

export default ThankYou;