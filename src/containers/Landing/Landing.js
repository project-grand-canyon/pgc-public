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
        stats: {}
    }

    componentDidMount = () => {
        axios_api.get('stats').then((response)=>{
            const stats = (response.status == 200) ? response.data : { 'totalCallers': 'thousands of'}
            this.setState({
                stats: stats
            })
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

        return (
            <ResponsiveLayout activeLinkKey="/">
                <Hero actioned={this.didActionCTA} callerCount={this.state.stats.totalCallers} />
                <PitchSections actioned={this.didActionCTA} />
                <BottomHero actioned={this.didActionCTA} />
            </ResponsiveLayout>
        );
    }
}

export default Landing;
