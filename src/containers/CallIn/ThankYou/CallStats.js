import React from 'react'
import _ from 'lodash'
import { Card, Col, Row, Progress, Statistic, Tooltip } from 'antd'
import styled from '@emotion/styled'

import { isSenatorDistrict } from '../../../util/district'

const MAX_MONTHS_FOR_AVG = 3

const _processStats = ({ callsByMonth }) => {
    const today = new Date()
    const currentMonthKey = `${today.getFullYear()}-${today.getMonth() + 1}`

    const lastFewMonths = _(callsByMonth)
        .sortBy((__, monthKey) => monthKey)
        .slice(1, MAX_MONTHS_FOR_AVG + 1)

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

const SideStatWrapper = styled.div`
    margin-bottom: 1rem;
`
const SideStatLabel = styled.div`
    font-size: 0.9rem;
    color: #999999;
`
const SideStatValue = styled.div`
    font-size: 1.2rem;
`

const SideStat = ({ label, value }) => {
    return (
        <SideStatWrapper>
            <SideStatLabel>{label}</SideStatLabel>
            <SideStatValue>{value}</SideStatValue>
        </SideStatWrapper>
    )
}


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

    return (
        <Card>
            <Row gutter={{ sm: 16, md: 20 }}>
                <Col xs={24} sm={14}>
                    <Statistic title="Total calls for this district" value={currentMonthCalls} />
                    <Tooltip 
                        title={`${MAX_MONTHS_FOR_AVG} month average: ${rollingAverage} calls`}
                        placement="bottom"
                        mouseEnterDelay={0.5}
                    >
                        <StyledProgress 
                            percent={percent} 
                            successPercent={successPercent} 
                            showInfo={false}
                            status="normal"
                        />
                    </Tooltip>
                </Col>
                <Col xs={24} sm={10}>
                    <SideStat label={`Callers for ${repName}`} value={currentMonthCalls} />
                    {overallStats && <SideStat label="Callers Nationwide" value={overallStats.totalCallers} />}
                    {overallStats && <SideStat label="Total Calls Nationwide" value={overallStats.totalCalls} />}
                </Col>
            </Row>
        </Card>

    )

    // const localCalls = localStats && localStats.totalCalls;
    // const localCallers = localStats && localStats.totalCallers;
    // const overallCalls = overallStats && overallStats.totalCalls;
    // const overallCallers = overallStats && overallStats.totalCallers;

    // const isSen = isSenatorDistrict(district);
    // const repName = isSen ? `Senator ${district.repLastName}` : `Rep. ${district.repLastName}`;

    // const localCallsCol = <StatCell title={`Total Calls to ${repName}`} value={localCalls} icon="phone" />
    // const overallCallsCol = <StatCell title="Total Calls Nationwide" value={overallCalls} icon="phone" />
    // const localCallersCol = <StatCell title={`People signed up to call ${repName}`} value={localCallers} icon="smile" />
    // const overallCallersCol = <StatCell title="Registered Callers Nationwide" value={overallCallers} icon="smile" isSen={isSen} />

    // const repCallers = (
    //     <>
    //         {!isSen && localCallersCol}
    //         {overallCallersCol}
    //     </>
    // )

    // return (
    //     <div>
    //         <Row>
    //             <Typography.Title level={3}>Our Impact So Far:</Typography.Title>
    //         </Row>
    //         <Row type="flex" justify="center" align="middle">
    //             {localCallsCol}
    //             {overallCallsCol}
    //         </Row>
    //         <Row type="flex" justify="center" align="middle">
    //             {repCallers}
    //         </Row>
    //     </div>
    // )  
}

export default CallStats