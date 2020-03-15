import React from 'react';
import { Avatar, Typography } from 'antd';
import styled from '@emotion/styled'

import { isSenatorDistrict } from '../../../util/district';

const CallLink = styled.a`
    display: flex;
    flex-direction: row;
    align-items: center;
    background: #ffffff;
    padding: 0.5rem;
    margin-bottom: 0.75rem;
    width: 23rem;

    &:hover {
        background: #F0F3BD;
    }
`

const CallText = styled.span`
    font-weight: 500;
    font-size: 1.1rem;
    padding: 0.5rem;
`

const OtherCallTargets = ({ districts = [] }) => {
    const callTargets = districts
        .filter(callTarget => !!callTarget)
        .map(callTarget => {
            return (      
                <CallLink
                    target="_blank"
                    href={`/call/${callTarget.state}/${callTarget.number}`}
                >
                    <Avatar size={64} shape="square" src={callTarget.repImageUrl} />
                    <CallText>
                        {`Call ${isSenatorDistrict(callTarget) ? "Senator" : "Representative"} ${callTarget.repLastName}`}
                    </CallText>
                </CallLink>    
            )
        })

    return (
        <>
            <Typography.Title level={3}>Here's how you can do a little more:</Typography.Title>
            {callTargets}

        </>
    )
}

export default OtherCallTargets