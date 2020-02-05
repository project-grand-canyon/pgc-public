import React, { useEffect, useState } from 'react'
import axios from '../../../util/axios-api'
import _ from 'lodash'

import { Card, Col, Icon, Row, Statistic, Typography } from 'antd'
import styles from './ThankYou.module.css'

import { isSenatorDistrict } from '../../../util/district'

const Stats = ({
    stateAbrv,
    districtNumber,
}) => {
    const [loading, setLoading] = useState(true)
    const [district, setDistrict] = useState()
    const [callStats, setCallStats] = useState({})

    useEffect(() => {
        axios.get('districts')
            .then((response) => {
                const foundDistrict = _.find(response.data, district => {
                    return stateAbrv === district.state
                        && districtNumber === parseInt(district.number)
                })

                if(!foundDistrict && !foundDistrict.districtId){
                    this.setState({
                        statsError: Error("No district found")
                    })
                    return;
                }

                setDistrict(foundDistrict)

                Promise.all([
                        axios.get(`stats/${foundDistrict.districtId}`), 
                        axios.get(`stats`)
                    ])
                    .then(([local, overall]) => {
                        setCallStats({
                            local,
                            overall,
                        })
                        setLoading(false)
                    })
                    .catch((error) => {
                        // TODO ERROR
                        setLoading(false)
                    });
                }
            );
    }, [stateAbrv, districtNumber])

    if (loading) {
        // TODO Loading dots
        return <div>LOADING...</div>
    }

    const localCalls = callStats.local && callStats.local.totalCalls
    const localCallers = callStats.local && callStats.local.totalCallers
    const overallCalls = callStats.overall && callStats.overall.totalCalls
    const overallCallers = callStats.overall && callStats.overall.totalCallers
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
    );        
}

export default Stats
