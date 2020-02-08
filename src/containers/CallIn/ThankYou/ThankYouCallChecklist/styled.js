import styled from '@emotion/styled'
import { css } from '@emotion/core'

export const ThankYouContainer = styled.div`
    
`
export const ThankYouMessage = styled.div`
    
`
export const MemberOfCongressList = styled.div`
    
`

const MemberOfCongressBase = css`
    display: flex;
    flex-direction: row;
    height: 80px;

    img {
        height: 100%;
    }
`
export const CalledMemberOfCongress = styled.div`
    ${MemberOfCongressBase}
`
export const CallableMemberOfCongress = styled.a`
    ${MemberOfCongressBase}
`
