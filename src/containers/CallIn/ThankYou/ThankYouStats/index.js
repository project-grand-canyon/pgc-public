import React, { useEffect, useState } from 'react'
import axios from 'util/axios-api'

import { Card, Col, Icon, Row, Spin, Statistic, Typography } from 'antd'

import { isSenatorDistrict } from 'util/district'

const LOADING = 'loading'
const NO_RESULTS = 'no-results'
const READY = 'ready'

const ThankYouStats = ({ district }) => {
    const [status, setStatus] = useState(LOADING)
    const [callStats, setCallStats] = useState({})

    useEffect(() => {
        Promise.all([
                axios.get(`stats`),
                district && axios.get(`stats/${district.districtId}`), 
            ])
            .then(([overall, local]) => {
                setCallStats({
                    overall, 
                    local,
                })
                setStatus(READY)
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
        <>
            <Row>
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
            </div>
        </>
    )       
}

export default ThankYouStats
