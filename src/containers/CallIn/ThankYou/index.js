import React, { Component } from 'react';
import { Card, Col, Icon, message, Row, Typography } from 'antd';
import { Redirect } from 'react-router-dom';
import _ from 'lodash'

import axios from 'util/axios-api'

import ThankYouStats from './ThankYouStats'
import ThankYouCallChecklist from './ThankYouCallChecklist'
import SimpleLayout from 'containers/Layout/SimpleLayout/SimpleLayout';
import styles from './ThankYou.module.css';

import capitol from 'assets/images/capitol-group.jpg';
import discussion from 'assets/images/discussion.jpeg';
import grassroots from 'assets/images/grassroots.jpg';


class ThankYou extends Component {

    state = {
        signUpRedirect: false,
        wasActualCall: false,
        otherDistricts: null,
        calledDistrict: null,
    }

    componentDidMount = () => {
        const urlParams = new URLSearchParams(this.props.location.search.slice(1));
        const stateAbrv = urlParams.has('state') && urlParams.get('state').toLowerCase()
        const districtNumber = urlParams.has('district') && parseInt(urlParams.get('district'))
        
        // Delete the tracking ID 
        urlParams.delete('t');

        // Prevent callers from going back into the path with the tracking ID
        // so that we don't report the call twice
        this.props.history.push({
            pathname: this.props.history.location.pathname,
            search: urlParams.toString(),
            state: {...this.state}
        })

        axios.get('districts')
            .then((response) => {
                const calledDistrict = _.find(response.data, district => {
                    return stateAbrv === district.state.toLowerCase()
                        && districtNumber === district.number
                })

                if (!calledDistrict || !calledDistrict.districtId) {
                    console.warn(`No district found for ${stateAbrv}-${districtNumber}`)
                    return
                }

                const otherDistrictIds = _.map(calledDistrict.callTargets, ({ targetDistrictId }) => targetDistrictId)
                const otherDistricts = _.filter(response.data, district => {
                    return _.includes(otherDistrictIds, district.districtId) 
                        && district.districtId !== calledDistrict.districtId
                })

                this.setState({ calledDistrict, otherDistricts })
            })
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

    render() {
        if (this.state.signUpRedirect) {
            return <Redirect to="/signup" />
        }

        return (
            <SimpleLayout activeLinkKey="/signup">
                <ThankYouStats district={this.state.calledDistrict} />
                
                <ThankYouCallChecklist 
                    calledDistrict={this.state.calledDistrict} 
                    otherDistricts={this.state.otherDistricts} 
                />

                <div className={styles.ThankYou}>
                    <div className={styles.Heading}>
                        <Typography.Title level={2}>Thank You for Calling</Typography.Title>
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
