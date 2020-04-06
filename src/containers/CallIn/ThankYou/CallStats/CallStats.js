import React from 'react'
import _ from 'lodash'
import { Card, Col, Row, Progress, Statistic, Typography } from 'antd'
import styled from '@emotion/styled'

import { isSenatorDistrict } from '../../../../util/district'
import SimpleStat from './SimpleStat'
import MonthlyCalls from './MonthlyCalls'

const MAX_MONTHS_FOR_AVG = 3

const _processStats = ({ callsByMonth }) => {
    const today = new Date()
    const currentMonthKey = `${today.getFullYear()}-${today.getMonth() + 1}`

    const maxCalls = 0
    const lastFewMonths = _(callsByMonth)
        .map((numCalls, monthKey) => ({ monthKey, numCalls }))
        .sortBy(x => x.monthKey)
        .slice(1, MAX_MONTHS_FOR_AVG + 1)
        .each(x => maxCalls = Math.max(maxCalls, x.numCalls))
        .value()

    const currentMonthCalls = callsByMonth[currentMonthKey] || 0
    const rollingAverage = lastFewMonths.sum() / lastFewMonths.value().length
    const percentComplete = Math.round(currentMonthCalls / rollingAverage * 100)

    return percentComplete > 100 ? {
        rollingAverage,
        currentMonthCalls,
        percent: 100,
        successPercent: Math.round(100 / percentComplete * 100),
    } : {
        rollingAverage,
        currentMonthCalls,
        percent: percentComplete,
    }
}

const processStats = () => ({
    rollingAverage: 20,
    currentMonthCalls: 5,
    percent: 100,
    successPercent: 60,
})

const StyledProgress = styled(Progress)`
    // The excess color
    .ant-progress-success-bg {
        background: #1094D3;
    }

    // The main color
    .ant-progress-bg {
        background: #A5CE39;
    }
`

const CallStats = ({ district, localStats, overallStats }) => {
    if (!localStats || !district.repLastName) {
        return null;
    }

    const { 
        percent, 
        successPercent, 
        rollingAverage, 
        currentMonthCalls,
    } = processStats(localStats)

    const localCalls = localStats && localStats.totalCalls;
    const localCallers = localStats && localStats.totalCallers;
    const overallCalls = overallStats && overallStats.totalCalls;
    const overallCallers = overallStats && overallStats.totalCallers;

    const isSen = isSenatorDistrict(district);
    const repName = isSen ? `Senator ${district.repLastName}` : `Rep. ${district.repLastName}`;
    const { repImageUrl } = district

    return (
        <Card>
            <Row gutter={{ sm: 16, md: 20 }}>
                {localStats && (
                    <Col xs={24} sm={14}>
                        <Typography.Title level={4}>
                            {`${repName}'s District`}
                        </Typography.Title>
                        <Row>
                            <Col xs={12}>
                                <SimpleStat inline>
                                    <SimpleStat.Value>{localStats.totalCalls}</SimpleStat.Value>
                                    <SimpleStat.Label>total calls</SimpleStat.Label>
                                </SimpleStat>
                            </Col>
                            <Col xs={12}>
                                <SimpleStat inline>
                                    <SimpleStat.Value>{localStats.totalCallers}</SimpleStat.Value>
                                    <SimpleStat.Label>callers</SimpleStat.Label>
                                </SimpleStat>
                            </Col>
                        </Row>
                        <MonthlyCalls 
                            repName={repName} 
                            repImageUrl={repImageUrl} 
                            callsByMonth={localStats.callsByMonth} 
                        />
                    </Col>
                )}
                {overallStats && (
                    <Col xs={24} sm={10}>
                        <Typography.Title level={4}>Nationwide</Typography.Title>
                        <SimpleStat>
                            <SimpleStat.Label>Registered Callers</SimpleStat.Label>
                            <SimpleStat.Value>{overallStats.totalCallers}</SimpleStat.Value>
                        </SimpleStat>
                        <SimpleStat>
                            <SimpleStat.Label>Total Calls</SimpleStat.Label>
                            <SimpleStat.Value>{overallStats.totalCalls}</SimpleStat.Value>
                        </SimpleStat>
                    </Col>
                )}
            </Row>
        </Card>

    )
}

export default CallStats
