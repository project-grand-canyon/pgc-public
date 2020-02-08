import React from 'react'
import _ from 'lodash'

import { 
    ThankYouContainer,
    ThankYouMessage,
    MemberOfCongressList,
    CalledMemberOfCongress,
    CallableMemberOfCongress,
} from './styled'

/*

created: "2019-05-27 19:14"
lastModified: "2020-02-06 17:16"
districtId: 532
state: "CA"
number: 12
repFirstName: "Nancy"
repLastName: "Pelosi"
repImageUrl: "https://raw.githubusercontent.com/unitedstates/images/gh-pages/congress/450x550/P000197.jpg"
callTargets: [{…}]
scriptModifiedTime: 1578411491000
lastStaleScriptNotification: 1581009388000
info: ""

 */

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
                Thank you for calling
            </ThankYouMessage>
            <MemberOfCongressList>
                {_.map(allDistricts, district => <MemberOfCongress {...district} />)}
            </MemberOfCongressList>
        </ThankYouContainer>
    )
}

export default ThankYouCallChecklist