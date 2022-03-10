import styled from 'styled-components'

const FlexLayout = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  & > * {
    min-width: 280px;
    max-width: 100%; //31.5%;
    width: 100%;
    margin: 0 28px;
    margin-bottom: 32px;

    ${({ theme }) => theme.mediaQueries.md} {
      max-width: 28%;
    }
  }
`

export default FlexLayout
