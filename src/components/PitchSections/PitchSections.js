import React from 'react';
import { Divider } from 'antd';

import TextPitchSection from './TextPitchSection/TextPitchSection';
import ImagePitchSection from './ImagePitchSection/ImagePitchSection';


import styles from './PitchSections.module.css';

import HowWorkImage from '../../assets/images/river.jpg'
import CallersImage from '../../assets/images/call.jpg'
import MNGroupImage from '../../assets/images/mn-group.jpg'
import CCLLogoImage from '../../assets/images/logo.png'

const pitchsections = (props) => {
    return (
        <div className={styles.PitchSections}>
            <TextPitchSection title="About" position={1}>
                <p>Congressional staffers and representatives have told us nothing is more powerful in helping a representative know what their constituents want than written letters and phone calls.</p>
                <p>Based on this fact, an effort called Project Grand Canyon was born. Just as the Grand Canyon was excavated one water drop at a time, our Members of Congress’ resistance to climate solutions will be worn down by the drip, drip, drip of thousands of phone calls per month.</p>
            </TextPitchSection>
            <Divider style={{margin: 0}} />
            <ImagePitchSection actioned={props.actioned} title="Who are you?" position={2} location={CCLLogoImage} alt="ccl logo">
                <p>We are a group of Citizens' Climate Lobby (CCL) volunteers from Central Texas.</p>
                <p>CCL is a non-profit, nonpartisan, grassroots organization focused on national policies to address climate change.</p>
                <p>CCL's consistently respectful, nonpartisan approach to climate education is designed to create a broad, sustainable foundation for climate action.</p>
            </ImagePitchSection>
            <Divider style={{margin: 0}}  />
            <ImagePitchSection actioned={props.actioned} title="How does it work?" position={3} location={HowWorkImage} alt="pretty river image">
                <p>Each month, thousands of Americans call their U.S. Congressperson respectfully urging congressional action on climate change.</p>
                <p>Together, volunteers form a slow, steady stream of calls, day after day, eroding their Congressperson’s resistance to climate solutions.</p>
            </ImagePitchSection>
            <Divider style={{margin: 0}}  />
            <ImagePitchSection actioned={props.actioned} title="What do I do?" position={4} location={CallersImage} alt="callers image">
                <p>Each month, you will receive an email or text message that links to your call-in guide.</p>
                <p>You'll call your Congressperson's office and respectfully urge climate action by discussing your topic.</p>
            </ImagePitchSection>
            <Divider style={{margin: 0}}  />
            <ImagePitchSection actioned={props.actioned} title="Does it work?" position={5} location={MNGroupImage} alt="minnesota chapter image">
                <p>CCL volunteers in Minnesota (photographed at the U.S. Capitol) have been implementing Project Grand Canyon since Spring of 2017.</p>
                <p>Their Member of Congress at the time, Jason Lewis, had been resisting meeting with CCL. After all the calls, the Member invited CCL for an hour long meeting.</p>
                <p>In their words, <i>Did we convert him in one meeting? NO. Did we educate him? Absolutely. Our MOC encouraged us to "keep it coming," and our liaison started to have regular contact with him.</i></p>
            </ImagePitchSection>
        </div>
    );
};

export default pitchsections;
