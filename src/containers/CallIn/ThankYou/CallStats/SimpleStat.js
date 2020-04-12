import styled from '@emotion/styled'

const SimpleStat = styled.div`
    margin-bottom: 1rem;
    display: flex;
    flex-direction: ${props => props.inline ? 'row': 'column'};
    align-items: baseline;
`
SimpleStat.Label = styled.div`
    font-size: 0.9rem;
    line-height: 1;
    margin-bottom: 0.5rem;
    color: #999999;
`
SimpleStat.Value = styled.div`
    font-size: 1.5rem;
    line-height: 1.25;
    margin-right: 0.3rem;
`

export default SimpleStat
