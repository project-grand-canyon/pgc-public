import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import axios_api from '../../util/axios-api';
import ResponsiveLayout from '../Layout/ResponsiveLayout/ResponsiveLayout';
import BottomHero from '../../components/BottomHero/BottomHero';
import Hero from '../../components/Hero/Hero';
import PitchSections from '../../components/PitchSections/PitchSections';
import { Divider } from 'antd';

class Landing extends Component {
    
    constructor(props) {
        super(props);
        this.pitchSectionsRef = React.createRef();
    }

    state = {
        didActionCTA: false,
        stats: null
    }

    componentDidMount = () => {
        const defaultStats = { 'totalCallers': 'thousands of'};
        axios_api.get('stats').then((response)=>{
            const stats = (response.status === 200) ? response.data : defaultStats;
            this.setState({
                stats: stats
            });
        }).catch((error) => {
            this.setState({
                stats: defaultStats
            });
          });
    }

    onStartCalling = () => {
        this.setState({
            didActionCTA: true
        });
    }

    onMoreInfo = () => {
        this.pitchSectionsRef 
            && this.pitchSectionsRef.current 
            && this.pitchSectionsRef.current.scrollIntoView({
                "behavior": "smooth"
            });
    }

    render() {

        if (this.state.didActionCTA) {
            return <Redirect to="/signup" />
        }

        const totalCallers = this.state.stats && this.state.stats.totalCallers;

        return (
            <ResponsiveLayout activeLinkKey="/">
                <Hero onStartCalling={this.onStartCalling} onMoreInfo={this.onMoreInfo} callerCount={totalCallers} />
                <Divider style={{"margin": "0"}}/>
                <div ref={this.pitchSectionsRef}>
                    <PitchSections/>
                </div>
                <Divider style={{"margin": "0"}} />
                <BottomHero onStartCalling={this.onStartCalling} />
            </ResponsiveLayout>
        );
    }
}

export default Landing;
