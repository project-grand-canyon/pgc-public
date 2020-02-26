import styled from '@emotion/styled'

const CCL_GREEN = `#9bc23b`

export const fadeHexColor = (hexColor, fade) => 
    `${hexColor}${Math.round(255 * fade).toString(16)}`

export const Well = styled.div`
    display: flex;
    justify-content: center;
    background: ${fadeHexColor(CCL_GREEN, 0.1)};
`
export const BarContainer = styled.div`
`
export const ThankYouText = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`