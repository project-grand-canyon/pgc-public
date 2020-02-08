import React from 'react';

import TextPitchSection from './TextPitchSection/TextPitchSection';

import { Typography } from 'antd';

import styles from './PitchSections.module.css';

class PitchSections extends React.Component {
    render() {
        return (
            <div className={styles.PitchSections}>
                <TextPitchSection title="How does it work?" position={1}>
                    <Typography.Paragraph>Each month, you will receive an email or text message with your call-in guide. You’ll call your representative’s office to express your concerns and respectfully urge climate action.</Typography.Paragraph>
                    <Typography.Paragraph>Sounds scary but it’s easier than you think.</Typography.Paragraph>
                    <Typography.Paragraph>You will talk to a staff member in your representative’s office or get a recording. They won't quiz you. They will simply ask for your name and address, then take notes as you express your concerns based on the talking points we'll provide you.</Typography.Paragraph>
                    <Typography.Paragraph>That’s it!</Typography.Paragraph>
                </TextPitchSection>
                <TextPitchSection title="Is it effective?" position={1}>
                    <Typography.Paragraph>Yes! CCL's Monthly Calling Campaign is designed to be an effective lobbying program.</Typography.Paragraph>
                    <Typography.Paragraph>Calls to Congress are most meaningful when you are courteous and personal, and you focus on a specific bill or issue.</Typography.Paragraph>
                    <Typography.Paragraph>Your phone is a potent tool for participatory democracy.</Typography.Paragraph>
                </TextPitchSection>
            </div>
        );
    }
};

export default PitchSections;
