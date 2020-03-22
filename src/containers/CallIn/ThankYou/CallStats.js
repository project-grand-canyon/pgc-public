import React from 'react';
import styled from '@emotion/styled'
import { Card, Col, Icon, Row, Statistic, Typography } from 'antd';

import { isSenatorDistrict } from '../../../util/district';

const StatsContainer = styled.div`

`
const StatCell = ({ title, icon, value, isSen }) => (
    <Col xs={24} sm={isSen ? 24 : 12}>
        <Card style={{height:"100%"}}>
            <Statistic 
                title={<Typography.Text style={{fontSize: "1.2em"}}>{title}</Typography.Text>} 
                value={value} 
                suffix={<Icon type={icon} />} 
            />
        </Card>
    </Col>
)

const CallStats = ({ district, localStats, overallStats }) => {
    if (!district.repLastName) {
        return null;
    }

    const localCalls = localStats && localStats.totalCalls;
    const localCallers = localStats && localStats.totalCallers;
    const overallCalls = overallStats && overallStats.totalCalls;
    const overallCallers = overallStats && overallStats.totalCallers;

    const isSen = isSenatorDistrict(district);
    const repName = isSen ? `Senator ${district.repLastName}` : `Rep. ${district.repLastName}`;

    const localCallsCol = <StatCell title={`Total Calls to ${repName}`} value={localCalls} icon="phone" />
    const overallCallsCol = <StatCell title="Total Calls Nationwide" value={overallCalls} icon="phone" />
    const localCallersCol = <StatCell title={`People signed up to call ${repName}`} value={localCallers} icon="smile" />
    const overallCallersCol = <StatCell title="Registered Callers Nationwide" value={overallCallers} icon="smile" isSen={isSen} />

    const repCallers = (
        <>
            {!isSen && localCallersCol}
            {overallCallersCol}
        </>
    )

    return (
        <StatsContainer>
            <Row>
                <Typography.Title level={3}>Our Impact So Far:</Typography.Title>
            </Row>
            <Row type="flex" justify="center" align="middle">
                {localCallsCol}
                {overallCallsCol}
            </Row>
            <Row type="flex" justify="center" align="middle">
                {repCallers}
            </Row>
        </StatsContainer>
    )  
}

export default CallStats