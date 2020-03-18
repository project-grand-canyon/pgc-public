import React, { Component } from 'react';
import styled from '@emotion/styled'
import { 
    Button,
    Col, 
    Alert,
    message, 
    Row, 
    Typography,
    List,
} from 'antd';
import { Redirect } from 'react-router-dom';

import SimpleLayout from '../../Layout/SimpleLayout/SimpleLayout';
import axios from '../../../util/axios-api';
import getUrlParameter from '../../../util/urlparams';

import CallThermometer from './CallThermometer';
import OtherCallTargets from './OtherCallTargets';

const Well = styled.div`
    background: #EEEEEE;
    padding: 3rem 0.5rem 5rem;
`

class ThankYou extends Component {
    state = {
        eligibleCallTargets: null,
        district: null,
        stats: null,
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
                    stats: {
                        district,
                        overall,
                    }
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

    signupRedirect = () => {
        this.setState({ signUpRedirect: true })
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
                <Well>
                    <Row type="flex" justify="center" gutter={[24, 24]}>
                        <Col xs={24} md={7} lg={5} justify="right">
                            {this.state.statsError && <Alert message={this.state.statsError} type="error" /> }
                            {this.state.stats && <CallThermometer data={this.state.stats} /> }
                        </Col>
                        <Col xs={24} md={14} lg={10}>
                            <Typography.Title level={1}>Thank You for Calling</Typography.Title>
                            {this.state.eligibleCallTargets && <OtherCallTargets districts={this.state.eligibleCallTargets} /> }
                            <List>
                                {!this.state.identifier && (
                                    <List.Item>
                                        <List.Item.Meta
                                            title="Sign Up for Call Reminders"
                                            description={
                                                <>
                                                    <p>If you haven't done it already, sign up to get a monthly call reminder.</p>
                                                    <Button onClick={() => this.signupRedirect} icon="notification">Remind Me!</Button>
                                                </>
                                            }
                                        />
                                        
                                    </List.Item>
                                )}
                                <List.Item>
                                    <List.Item.Meta
                                        title="Join Citizens' Climate Lobby"
                                        description={
                                            <>
                                                <p>CCL volunteers created this site, and we would love for you to join us.</p>
                                                <Button 
                                                    target="_blank" 
                                                    href="https://citizensclimatelobby.org/join-citizens-climate-lobby/"
                                                    icon="user-add" 
                                                >
                                                    Sign Up
                                                </Button>
                                            </>
                                        }
                                    />
                                </List.Item>
                                <List.Item>
                                    <List.Item.Meta
                                        title="Share the Calling Congress Campaign"
                                        description={
                                            <>
                                                <p>The more people who call, the more our representatives listen. Spread the word.</p>
                                                <Button icon="facebook" type="link" onClick={() => this.handleShare('facebook')}>Facebook</Button>
                                                <Button icon="twitter" type="link" onClick={() => this.handleShare('twitter')}>Twitter</Button>
                                                <Button icon="copy" type="link" onClick={() => this.handleShare('copy')}>Copy Link</Button>
                                            </>
                                        }
                                    />
                                </List.Item>
                            </List>
                        </Col>
                    </Row>
                </Well>
            </SimpleLayout>
        )
    }
}

export default ThankYou;
