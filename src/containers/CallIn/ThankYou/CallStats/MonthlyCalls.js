import React from 'react'
import _ from 'lodash'
import styled from '@emotion/styled'
import Color from 'color'
import { Tooltip } from 'antd'
import SimpleStat from './SimpleStat'

const Green = Color('#A5CE39')

const ChartWrapper = styled.div`
    height: 100px;
    display: flex;
    flex-direction: row;
    align-items: baseline;
`
const ChartBar = styled.div`
    height: ${({ value, max }) => value / max * 100 }%;
    width: 0.5rem;
    background: ${Green.string()};
    margin-left: 0.5rem;
    border-radius: 0.25rem;

    &:hover {
        background: ${Green.darken(0.2).string()}
    }
`

const NUM_MONTHS_TO_CHART = 12

const MonthlyCalls = ({ repName, repImageUrl, callsByMonth }) => {
    let maxCalls = 0
    const lastFewMonths = _(callsByMonth)
        .map((numCalls, monthKey) => ({ monthKey, numCalls }))
        .sortBy(x => x.monthKey)
        .slice(0, NUM_MONTHS_TO_CHART)
        .each(x => maxCalls = Math.max(maxCalls, x.numCalls))

    return (
        <ChartWrapper>
            <img height="100%" alt={repName} src={repImageUrl} />
            {lastFewMonths.map(({ numCalls, monthKey }) => (
                <Tooltip
                    key={monthKey}
                    title={`${monthKey}: ${numCalls} calls`}
                    placement="top"
                >
                    <ChartBar value={numCalls} max={maxCalls} />
                </Tooltip>
            ))}
        </ChartWrapper>
    )
}

export default MonthlyCalls
