import React, { Component } from 'react';
import { Card, Col, Icon, message, Row, Typography } from 'antd';
import { Redirect } from 'react-router-dom';
import styled from '@emotion/styled'

import SimpleLayout from '../../Layout/SimpleLayout/SimpleLayout';
import axios from '../../../util/axios-api';
import getUrlParameter from '../../../util/urlparams';

import capitol from '../../../assets/images/capitol-group.jpg';
import discussion from '../../../assets/images/discussion.jpeg';
import grassroots from '../../../assets/images/grassroots.jpg';
import OtherCallTargets from './OtherCallTargets';
import CallStats from './CallStats';


const CONTENT_WIDTH_PX = 900
const StyledRow = styled(Row)`
    background: ${props => props.bg};
    padding: 1.4em;

    @media (min-width: ${CONTENT_WIDTH_PX + 20}px) {
        padding: 2em calc(50vw - ${CONTENT_WIDTH_PX / 2}px);
    }
`
const ColorContentRow = ({ bg, children}) => (
    <StyledRow 
        bg={bg || 'transparent'} 
        type="flex" 
        justify="center" 
        gutter={[20, 20]}
    >
        {children}
    </StyledRow>
)

class ThankYou extends Component {

    state = {
        eligibleCallTargets: [],
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
                const eligibleCallTargets = this.eligibleCallTargetDistrictIds(
                    homeDistrictNumber, 
                    calledState, 
                    calledNumber, 
                    districts
                )
                this.setState({
                    district: calledDistrict,
                    eligibleCallTargets: eligibleCallTargets.length ? eligibleCallTargets : null,                    
                })
            }
        })
    }

    eligibleCallTargetDistrictIds = (homeDistrictNumber, calledState, calledNumber, districts) => {
        return [-1, -2, homeDistrictNumber]
            .filter(el => {
                return `${el}` !== `${calledNumber}`
            })
            .map(districtNumber => {
                return this.findDistrictByStateNumber(calledState, districtNumber, districts)
            })
            // Filter out the `covid_paused` districts
            .filter(district => district && district.status === 'active')
    }

    fetchDistricts = (cb) => {
        axios.get('districts').then((response)=>{
            const districts = response.data;
            cb(districts)
        });
    }

    findDistrictByStateNumber = (state, number, districts) => {
        return districts.find(el => (
            state.toLowerCase() === el.state.toLowerCase() && parseInt(number) === parseInt(el.number)
        ))
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

    render() {
        if (this.state.signUpRedirect) {
            return <Redirect to="/signup" />
        }

        return (
            <SimpleLayout activeLinkKey="/signup">
                <ColorContentRow bg="#ececec">
                    <Col xs={24} align="center">
                        <Typography.Title level={1}>Thank You for Calling</Typography.Title>
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
                            <OtherCallTargets districts={this.state.eligibleCallTargets} />
                        </Col>
                    )}
                </ColorContentRow>
                <ColorContentRow>
                    {
                        !this.state.identifier && (<Col xs={24} sm={12} lg={8}>
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
                    <Col xs={24} sm={12} lg={8}>
                        <Card
                            cover={<img alt="US Captitol Building" src={discussion} />}
                            actions={[
                                <Icon type="facebook" onClick={()=>{this.handleShare('facebook')}} />, 
                                <Icon type="twitter" onClick={()=>{this.handleShare('twitter')}} />, 
                                <Icon type="mail" onClick={()=>{this.handleShare('email')}} />
                            ]}
                        >
                            <Card.Meta
                            title="Share the Calling Congress Campaign"
                            description="The more people who call, the more our representatives listen. Spread the word."
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} lg={8}>
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
                </ColorContentRow>
            </SimpleLayout>
        )
    }
}

export default ThankYou;
