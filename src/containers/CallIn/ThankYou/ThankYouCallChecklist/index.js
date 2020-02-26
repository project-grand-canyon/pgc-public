import React from 'react'
import _ from 'lodash'

import { 
    ThankYouContainer,
    ThankYouMessage,
    MemberOfCongressList,
    CalledMemberOfCongress,
    CallableMemberOfCongress,
} from './styled'

const MemberOfCongress = ({ 
    repFirstName, 
    repLastName,
    repImageUrl,
    state,
    number,
}) => {
    const repName = `${repFirstName} ${repLastName}`
    return (
        <CallableMemberOfCongress href={`/call/${state}/${number}`}>
            <img alt={repName} src={repImageUrl} />
            <div>Call {repName}</div>
        </CallableMemberOfCongress>
    )
}

const ThankYouCallChecklist = ({
    calledDistrict,
    otherDistricts,
}) => {
    const allDistricts = otherDistricts ? [calledDistrict, ...otherDistricts] : [calledDistrict]

    return (
        <ThankYouContainer>
            <ThankYouMessage>
                You should also call:
            </ThankYouMessage>
            <MemberOfCongressList>
                {_.map(allDistricts, district => <MemberOfCongress {...district} />)}
            </MemberOfCongressList>
        </ThankYouContainer>
    )
}

export default ThankYouCallChecklist