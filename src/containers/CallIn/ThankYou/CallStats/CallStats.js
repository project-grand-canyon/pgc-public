import React from 'react'
import _ from 'lodash'
import { Card, Col, Row, Tooltip, Typography } from 'antd'
import styled from '@emotion/styled'

import { isSenatorDistrict } from '../../../../util/district'
import SimpleStat from './SimpleStat'
import MonthlyCalls from './MonthlyCalls'

import usaMapImg from '../media/usa-map-green.png';

const BottomRightAnchor = styled.div`
    width: 100px;
    opacity: 0.75;
    position: absolute;
    right: 8px;
    bottom: 0;

    img {
        width: 100%;
    }
`

const CallStats = ({ district, localStats, overallStats }) => {
    if (!localStats || !district.repLastName) {
        return null;
    }

    const isSen = isSenatorDistrict(district);
    const repName = isSen ? `Senator ${district.repLastName}` : `Rep. ${district.repLastName}`;
    const { repImageUrl } = district

    return (
        <Card>
            <Row gutter={{ sm: 24, md: 36 }}>
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
                    <>
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
                        <BottomRightAnchor>
                            <Tooltip 
                                position="top" 
                                title="Call your Senators!"
                            >
                                <img alt="Map of the United States" src={usaMapImg} />
                            </Tooltip>
                        </BottomRightAnchor>
                    </>
                )}
            </Row>
        </Card>

    )
}

export default CallStats
