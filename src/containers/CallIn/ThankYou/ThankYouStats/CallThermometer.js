import React from 'react'
import styled from '@emotion/styled'
import _ from 'lodash'

const SegmentLabel = styled.div`
    width: 10rem;
    text-align: right;
    font-size: 0.85rem;
    color: #777;
    padding-right: 0.5rem;
`
const Segment = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 4rem;
    height: ${({ value }) => `${value * 0.2 + 1}rem`};
    position: relative;
    background-color: ${({ color }) => color};
    transition-property: width;
    transition-duration: 300ms;

    > * {
        position: absolute;
        right: 70%;
        opacity: 0;
        transition-property: right opacity;
        transition-duration: 300ms;
    }

    &:hover {
        width: 5rem;

        > * {
            right: 100%;
            opacity: 1;
        }
    }
`
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 5rem;
`

const GREEN = `#9bc23b`
const DARK_GREEN = `#5a7931`
const BLUE = `#0081c7`
const LIGHT_BLUE = `#61c7ff`
const MED_BLUE = `#0079bb`
const DARK_BLUE = `#005d90`

let colorChoices = [
    GREEN,
    DARK_GREEN,
    BLUE,
    LIGHT_BLUE,
    MED_BLUE,
    DARK_BLUE,
]

const CallThermometer = ({ data }) => {
    let colorIndex = 0 
    const segments = _.map(data, ({ numCalls, monthDisplay }) => {
        if (!numCalls) return null
    
        const color = colorChoices[colorIndex]
        colorIndex = (colorIndex + 1) % colorChoices.length
    
        return (
            <Segment value={numCalls} color={color}>
                <SegmentLabel>{monthDisplay}: {numCalls}</SegmentLabel>
            </Segment>
        )
    })  

    return (
        <Container>
            {segments}
        </Container>
    )  
}

export default CallThermometer