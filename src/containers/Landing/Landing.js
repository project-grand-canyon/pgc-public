import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import axios_api from '../../util/axios-api';
import ResponsiveLayout from '../Layout/ResponsiveLayout/ResponsiveLayout';
import BottomHero from '../../components/BottomHero/BottomHero';
import Hero from '../../components/Hero/Hero';
import PitchSections from '../../components/PitchSections/PitchSections';

class Landing extends Component {
    
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

    didActionCTA = () => {
        this.setState({
            didActionCTA: true
        });
    }

    render() {

        if (this.state.didActionCTA) {
            return <Redirect to="/signup" />
        }

        const totalCallers = this.state.stats && this.state.stats.totalCallers;

        return (
            <ResponsiveLayout activeLinkKey="/">
                <Hero actioned={this.didActionCTA} callerCount={totalCallers} />
                <PitchSections actioned={this.didActionCTA} />
                <BottomHero actioned={this.didActionCTA} />
            </ResponsiveLayout>
        );
    }
}

export default Landing;
