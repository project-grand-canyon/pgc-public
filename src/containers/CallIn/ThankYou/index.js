import React, { Component } from 'react';
import { Card, Col, Divider, Icon, message, Row, Typography } from 'antd';
import { Redirect } from 'react-router-dom';

import ThankYouStats from './ThankYouStats'

import SimpleLayout from '../../Layout/SimpleLayout/SimpleLayout';

import styles from './ThankYou.module.css';

import capitol from '../../../assets/images/capitol-group.jpg';
import discussion from '../../../assets/images/discussion.jpeg';
import grassroots from '../../../assets/images/grassroots.jpg';


class ThankYou extends Component {

    state = {
        signUpRedirect: false,
        wasActualCall: false,
        stateAbrv: null,
        districtNumber: null,
    }

    componentDidMount = () => {
        const urlParams = new URLSearchParams(this.props.location.search.slice(1));
        const stateAbrv = urlParams.get('state') && urlParams.get('state').toLowerCase()
        const districtNumber = urlParams.get('district') && parseInt(urlParams.get('district')) 
        const wasActualCall = !!urlParams.get('t')
        
        // Delete the tracking ID 
        urlParams.delete('t');

        // Prevent callers from going back into the path with the tracking ID
        // so that we don't report the call twice
        this.props.history.push({
            pathname: this.props.history.location.pathname,
            search: `${urlParams.toString()}`,
            state: {...this.state}
        })

        this.setState({
            stateAbrv,
            districtNumber,
            wasActualCall,
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

        const pitch = this.state.stats ? "Please help us make a bigger impact:" : "Here's how you can do a little more:";

        return (
            <SimpleLayout activeLinkKey="/signup">
                <div className={styles.ThankYou}>
                    <div className={styles.Heading}>
                        <Typography.Title level={2}>Thank You for Calling</Typography.Title>
                    </div>
                    {this.state.stateAbrv && this.state.districtNumber && (
                        <>
                            <ThankYouStats
                                stateAbrv={this.state.stateAbrv}
                                districtNumber={this.state.districtNumber}
                            />
                            <Divider />
                        </>
                    )}
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
