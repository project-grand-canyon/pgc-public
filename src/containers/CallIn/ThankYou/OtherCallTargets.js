import React from 'react';
import { Avatar, Button, Typography } from 'antd';
import styled from '@emotion/styled'

import { isSenatorDistrict } from '../../../util/district';

const CallLink = styled(Button)`
    width: 100%;
    display: flex;
    align-items: center;
    height: auto;
    font-weight: 500;
    font-size: 1.1rem;
    margin-bottom: 0.75rem;
`
const StyledAvatar = styled(Avatar)`
    margin-top: 0.5rem;
    margin-right: 0.5rem;
    margin-bottom: 0.5rem;
    border-style: solid;
    border-width: 2px;
`

const OtherCallTargets = ({ districts = [] }) => {
    const callTargets = districts.map(callTarget => {
        const link = `/call/${callTarget.state}/${callTarget.number}`
        return (    
            <CallLink
                key={link}
                type="primary"
                target="_blank"
                href={link}
            >
                <StyledAvatar size={64} shape="square" src={callTarget.repImageUrl} />
                {`Call ${isSenatorDistrict(callTarget) ? "Senator" : "Representative"} ${callTarget.repLastName}`}
            </CallLink>   
        )
    })

    return (
        <div>
            <Typography.Title level={3}>Here's how you can do a little more:</Typography.Title>
            {callTargets}
        </div>
    )
}

export default OtherCallTargets