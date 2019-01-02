import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import ResponsiveLayout from '../Layout/ResponsiveLayout';
import BottomHero from '../../components/BottomHero/BottomHero';
import Hero from '../../components/Hero/Hero';
import PitchSections from '../../components/PitchSections/PitchSections';

class Landing extends Component {
    render() {
        const SignupLink = props => {
            console.log('hi');
            return (<Link to="/signup" {...props} />);
        }
        return (
            <ResponsiveLayout activeLinkKey="/">
                <Hero actioned={SignupLink} />
                <PitchSections actioned={SignupLink} />
                <BottomHero actioned={SignupLink} />
            </ResponsiveLayout>
        );
    }
}

export default Landing;
