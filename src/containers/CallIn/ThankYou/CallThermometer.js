import React from 'react'
import styled from '@emotion/styled'
import _ from 'lodash'
import { DateTime } from 'luxon'

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
        width: 4.5rem;

        > * {
            right: 100%;
            opacity: 1;
        }
    }
`
const ThermometerText = styled.div`
    text-align: right;
    width: 100%;
    line-height: 1;
    padding: 0 0.5rem 0.5rem;
`
const TotalNumber = styled.div`
    font-size: 2rem;
    white-space: nowrap;
    font-weight: 300;
`
const TotalLabel = styled.div`
    text-transform: uppercase;
    font-size: 0.75rem;
    opacity: 0.6;
`
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`

const SEA_BLUE = `#05668D`
const SEAWEED = `#028090`
const PERSIAN_GREEN = `#00A896`
const CARIBBEAN_GREEN = `#02C39A`
const MORNING_SUN = `#F0F3BD`

let colorChoices = [
    SEA_BLUE,
    SEAWEED,
    PERSIAN_GREEN,
    CARIBBEAN_GREEN,
    MORNING_SUN,
]

const CallThermometer = ({ callsByMonth }) => {
    let total = 0
    let colorIndex = 0 
    const segments = _(callsByMonth)
        .map((numCalls, monthKey) => {
            const monthDisplay = DateTime.fromFormat(monthKey, 'yyyy-MM').toFormat('MMMM yyyy')

            return {
                monthKey,
                monthDisplay,
                numCalls,
            }
        })
        .sortBy(({ monthKey }) => monthKey)
        .map(({ numCalls, monthDisplay }) => {
            if (!numCalls) return null
        
            const color = colorChoices[colorIndex]
            colorIndex = (colorIndex + 1) % colorChoices.length
            total += numCalls
        
            return (
                <Segment value={numCalls} color={color}>
                    <SegmentLabel>{monthDisplay}: {numCalls}</SegmentLabel>
                </Segment>
            )
        })
        .value()  

    return (
        <Container>
            <ThermometerText>
                <TotalNumber>{total}</TotalNumber>
                <TotalLabel>calls</TotalLabel>
            </ThermometerText>
            {segments}
        </Container>
    )  
}

export default CallThermometer