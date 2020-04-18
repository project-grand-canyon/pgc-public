import '@testing-library/jest-dom'

import React from 'react'
import {render, fireEvent, screen} from '@testing-library/react'
import OtherCallTargets from './OtherCallTargets'
import repDistrict from '../../../test/fixtures/districts/wa_9.json'
import juniorSenatorDistrict from '../../../test/fixtures/districts/wa_junior_senator.json'

const trackingToken = "1234"
const callerId = "4321"

const untrackedLinkProps = {
    districts: [repDistrict, juniorSenatorDistrict],
    trackingToken: null,
    callerId: null,
    homeDistrictNumber: null
}

const trackedLinkProps = {
    districts: [repDistrict, juniorSenatorDistrict],
    trackingToken,
    callerId,
    homeDistrictNumber: repDistrict.number
}

test('given tracking info, creates tracked link for Senator', () => {
    const expectedUrl = `http://localhost/call/${juniorSenatorDistrict.state}/${juniorSenatorDistrict.number}?t=${trackingToken}&c=${callerId}&d=${repDistrict.number}`
    const domQuery = `Call Senator ${juniorSenatorDistrict.repLastName}`
    testLink(trackedLinkProps, domQuery, expectedUrl)
})

test('given tracking info, creates tracked link for Representative', () => {
    const expectedUrl = `http://localhost/call/${repDistrict.state}/${repDistrict.number}?t=${trackingToken}&c=${callerId}&d=${repDistrict.number}`
    const domQuery = `Call Representative ${repDistrict.repLastName}`
    testLink(trackedLinkProps, domQuery, expectedUrl)
})

test('given only districts, creates untracked link for Senator', () => {
    const expectedUrl = `http://localhost/call/${juniorSenatorDistrict.state}/${juniorSenatorDistrict.number}`
    const domQuery = `Call Senator ${juniorSenatorDistrict.repLastName}`
    testLink(untrackedLinkProps, domQuery, expectedUrl)
})

test('given only districts, creates untracked link for Representative', () => {
    const expectedUrl = `http://localhost/call/${repDistrict.state}/${repDistrict.number}`
    const domQuery = `Call Representative ${repDistrict.repLastName}`
    testLink(untrackedLinkProps, domQuery, expectedUrl)
})

test('given only districts and home district, creates untracked link that includes home district', () => {

    const homeDistrictNumber = repDistrict.number
    const onlyDistrictProps = untrackedLinkProps;
    onlyDistrictProps['homeDistrictNumber'] = homeDistrictNumber

    const expectedUrl = `http://localhost/call/${repDistrict.state}/${repDistrict.number}?d=${homeDistrictNumber}`
    const domQuery = `Call Representative ${repDistrict.repLastName}`
    testLink(onlyDistrictProps, domQuery, expectedUrl)
})

function testLink(props, domQuery, expectedUrl) {
    render(<OtherCallTargets 
        districts={props.districts} 
        trackingToken={props.trackingToken} 
        callerId={props.callerId} 
        homeDistrictNumber={props.homeDistrictNumber} 
        />)      
        const cta = screen.queryByText(domQuery).parentElement
        expect(cta).toBeInTheDocument
        expect(cta.href).toBe(expectedUrl)
    }