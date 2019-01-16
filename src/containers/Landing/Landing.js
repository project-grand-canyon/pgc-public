import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import ResponsiveLayout from '../Layout/ResponsiveLayout/ResponsiveLayout';
import BottomHero from '../../components/BottomHero/BottomHero';
import Hero from '../../components/Hero/Hero';
import PitchSections from '../../components/PitchSections/PitchSections';

class Landing extends Component {
    
    state = {
        didActionCTA: false
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
                <Hero actioned={this.didActionCTA} />
                <PitchSections actioned={this.didActionCTA} />
                <BottomHero actioned={this.didActionCTA} />
            </ResponsiveLayout>
        );
    }
}

export default Landing;
