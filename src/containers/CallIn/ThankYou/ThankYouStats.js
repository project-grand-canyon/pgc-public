import React, { useEffect, useState } from 'react'
import axios from '../../../util/axios-api'

import { Card, Col, Icon, Row, Spin, Statistic, Typography } from 'antd'
import styles from './ThankYou.module.css'

import { isSenatorDistrict } from '../../../util/district'

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
                    localCalls: local.totalCalls,
                    localCallers: local.totalCallers,
                    overallCalls: overall.totalCalls,
                    overallCallers: overall.totalCallers,
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

    const {
        localCalls,
        localCallers,
        overallCalls,
        overallCallers,
    } = callStats
    const isSen = isSenatorDistrict(district)
    const repName = isSen ? `Senator ${district.repLastName}` : `Rep. ${district.repLastName}`

    return (
        <>
            <Row className={styles.Heading}>
                <Typography.Title level={4} style={{fontStyle: 'italic'}}>Our Impact So Far:</Typography.Title>
            </Row>
            <div style={{ background: '#ECECEC', padding: '30px' }}>
                <Row type="flex" justify="center" align="middle">
                    <Col xs={24} sm={12} md={6} className={styles.StatCol}>
                        <Card style={{height:"100%"}}>
                            <Statistic 
                                title={`Total Calls to ${repName}`} 
                                value={localCalls} 
                                suffix={<Icon type="phone" />} 
                            />
                        </Card>
                    </Col>
                    <Col xs={24} sm={12} md={6} className={styles.StatCol}>
                        <Card style={{height:"100%"}}>
                            <Statistic 
                                title="Total Calls Nationwide" 
                                value={overallCalls} 
                                suffix={<Icon type="phone" />} 
                            />
                        </Card>
                    </Col>
                </Row>
                <Row type="flex" justify="center" align="middle">
                    <Col xs={24} sm={isSen ? 24 : 12} md={isSen ? 12 : 6} className={styles.StatCol}>
                        <Card style={{height:"100%"}}>
                            <Statistic 
                                title="Registered Callers Nationwide" 
                                value={overallCallers} 
                                suffix={<Icon type="phone" />} 
                            />
                        </Card>
                    </Col>
                    {isSen && <Col xs={24} sm={12} md={6} className={styles.StatCol}>
                        <Card style={{height:"100%"}}>
                            <Statistic 
                                title={`People calling ${repName}`} 
                                value={localCallers} 
                                suffix={<Icon type="phone" />} 
                            />
                        </Card>
                    </Col>}
                </Row>
            </div>
        </>
    )       
}

export default ThankYouStats
