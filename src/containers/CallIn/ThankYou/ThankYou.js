import React, { Component } from 'react';
import { Card, Skeleton, Icon, message, Row, Col } from 'antd';
import { Redirect } from 'react-router-dom';

import SimpleLayout from '../../Layout/SimpleLayout/SimpleLayout';
import axios from '../../../util/axios-api';

import styles from './ThankYou.module.css';

import capitol from '../../../assets/images/capitol-group.jpg';
import discussion from '../../../assets/images/discussion.jpeg';
import grassroots from '../../../assets/images/grassroots.jpg';

class ThankYou extends Component {

    state = {
        state: null,
        district: null,
        identifier: null,
        stats: null,
        statsError: null,
        signUpRedirect: false
    }

    componentDidMount = () => {
        const urlParams = new URLSearchParams(this.props.location.search.slice(1));
        const state = urlParams.get('state') && urlParams.get('state').toUpperCase();
        const distrct = urlParams.get('district');
        this.fetchDistrictStats(state, distrct);
        this.removeTrackingGetArgs();
        this.setState({
            identifier: urlParams.get('t'),
            state: state || '',
            district: distrct
        });
    }

    fetchDistrictStats = (state, distrct) => {
        axios.get('district-stats', {
            params: {
                state: this.state.state,
                district: this.state.district
              }
        }).then((response) => {
            this.setState({
                stats: response.data
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

        if (this.state.stats){
            return (
                <Row type="flex" gutter={4}>
                    <Col span={24}>
                        <Card type="inner" title={`${this.state.state}-${this.state.district} Call In Stats`}>
                            <p>In the past 30 days, <span className={styles.Stat}>40 people</span> have called Rep. Williams about climate change.</p>
                            <p>So far this year, <span className={styles.Stat}>90 people</span> have called Rep. Williams about climate change.</p>
                            <p style={{fontStyle: "italic"}}>Congressional staffers and representatives have told us nothing helps a representative know what their constituents want more than written letters and phone calls, so keep up the great work!</p>
                        </Card>
                    </Col>
                </Row>
            );
        }

        return <Skeleton />
        
    }

    render() {
        
        if (this.state.signUpRedirect) {
            return <Redirect to="/signup" />
        }

        return (
            <SimpleLayout activeLinkKey="/signup">
                <div className={styles.ThankYou}>
                    <div className={styles.Heading}>
                        <h2>Thank You for Calling</h2>
                    </div>
                    { this.getStatsJSX() }
                    <div className={styles.Heading}>
                        <h3 style={{fontStyle: 'italic'}}>Here's how you can do a little more:</h3>
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
