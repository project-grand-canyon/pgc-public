import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import BottomHero from '../../components/BottomHero/BottomHero';
import Hero from '../../components/Hero/Hero';
import PitchSections from '../../components/PitchSections/PitchSections';

class Landing extends Component {
    render() {
        const SignupLink = props => <Link to="/signup" {...props} />
        return (
            <>
                <Hero actioned={SignupLink} />
                <PitchSections actioned={SignupLink} />
                <BottomHero actioned={SignupLink} />
            </>
        );
    }
}

export default Landing;
