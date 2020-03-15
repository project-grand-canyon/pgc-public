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
    transition-property: background color;
    transition-duration: 300ms;
    font-weight: 500;
    font-size: 1.1rem;
    border-radius: 4px;

    &:hover {
        background: #0081C7;
        color: white;
    }
`

const StyledAvatar = styled(Avatar)`
    margin-right: 0.5rem;
`

const OtherCallTargets = ({ districts = [] }) => {
    const callTargets = districts
        .filter(callTarget => !!callTarget)
        .map(callTarget => {
            const link = `/call/${callTarget.state}/${callTarget.number}`
            return (      
                <CallLink
                    key={link}
                    target="_blank"
                    href={link}
                >
                    <StyledAvatar size={64} shape="square" src={callTarget.repImageUrl} />
                    {`Call ${isSenatorDistrict(callTarget) ? "Senator" : "Representative"} ${callTarget.repLastName}`}
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