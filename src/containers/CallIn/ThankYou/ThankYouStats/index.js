import React, { useEffect, useState } from 'react'
import { DateTime } from 'luxon'
import axios from 'util/axios-api'
import _ from 'lodash'

import { Card, Col, Icon, Row, Spin, Statistic, Typography } from 'antd'
import CallThermometer from './CallThermometer'
import { 
    BarContainer, 
    Well, 
    ThankYouText,
} from './styled'

import { isSenatorDistrict } from 'util/district'

const MONTHS_TO_GRAPH = 6
const selectCallChartData = ({ callsByMonth }) => {
    const now = DateTime.local()

    return _(Array(MONTHS_TO_GRAPH))
        .map((__, index) => {
            const month = now.plus({ month: -1 * index })
            const monthKey = month.toFormat('yyyy-MM')
            const monthDisplay = month.toFormat('MMMM yyyy')
            const numCalls = callsByMonth[monthKey] || 0

            return {
                monthKey,
                monthDisplay,
                numCalls,
            }
        })
        .reverse()
        .value()
}

const LOADING = 'loading'
const NO_RESULTS = 'no-results'
const READY = 'ready'

const ThankYouStats = ({ district }) => {
    const [status, setStatus] = useState(LOADING)
    const [chartData, setChartData] = useState()

    useEffect(() => {
        Promise.all([
                axios.get(`stats`),
                district && axios.get(`stats/${district.districtId}`), 
            ])
            .then(([overallResponse, localResponse]) => {
                const newChartData = {
                    overall: overallResponse && selectCallChartData(overallResponse.data),
                    local: localResponse && selectCallChartData(localResponse.data),
                }

                if (newChartData.local || newChartData.overall) {
                    setChartData(newChartData)
                    setStatus(READY)
                } else {
                    setStatus(NO_RESULTS)
                }
            })
            .catch((error) => {
                setStatus(NO_RESULTS)
                console.error(error)
            });
    }, [district])

    if (status === LOADING) {
        return (
            <Row type="flex" justify="center">
                <Spin />
            </Row>
        )
    }

    if (status === NO_RESULTS) {
        return null
    }

    let repName

    if (district) {
        repName = isSenatorDistrict(district) 
            ? `Senator ${district.repLastName}` 
            : `Rep. ${district.repLastName}`
    }

    return (
        <Well>
            <BarContainer>
                {chartData.local && <CallThermometer data={chartData.local} />}
            </BarContainer>
            <ThankYouText>
                <h1>Thanks for calling in</h1>
                <h4>Your call really makes a difference</h4>
            </ThankYouText>
            {/* <Row>
                <Typography.Title level={4} style={{fontStyle: 'italic'}}>Our Impact So Far:</Typography.Title>
            </Row>
            <div style={{ background: '#ECECEC', padding: '30px' }}>
                <Row type="flex" justify="center" align="middle">
                    {callStats.local && (
                        <Col xs={24} sm={12} md={6}>
                            <Card style={{height:"100%"}}>
                                <Statistic 
                                    title={`Total calls to ${repName}`} 
                                    value={callStats.local.totalCalls} 
                                    suffix={<Icon type="phone" />} 
                                />
                            </Card>
                        </Col>
                    )}
                    {callStats.overall && (
                        <Col xs={24} sm={12} md={6}>
                            <Card style={{height:"100%"}}>
                                <Statistic 
                                    title="Total calls nationwide" 
                                    value={callStats.overall.totalCalls} 
                                    suffix={<Icon type="phone" />} 
                                />
                            </Card>
                        </Col>
                    )}
                </Row>
                <Row type="flex" justify="center" align="middle">
                    {callStats.local && (
                        <Col xs={24} sm={12} md={6}>
                            <Card style={{height:"100%"}}>
                                <Statistic 
                                    title={`People calling ${repName}`} 
                                    value={callStats.local.totalCallers} 
                                    suffix={<Icon type="phone" />} 
                                />
                            </Card>
                        </Col>
                    )}
                    {callStats.overall && (
                        <Col xs={24} sm={12} md={6}>
                            <Card style={{height:"100%"}}>
                                <Statistic 
                                    title="Peopls calling nationwide" 
                                    value={callStats.overall.totalCaller} 
                                    suffix={<Icon type="phone" />} 
                                />
                            </Card>
                        </Col>
                    )}
                </Row>
            </div> */}
        </Well>
    )       
}

export default ThankYouStats
