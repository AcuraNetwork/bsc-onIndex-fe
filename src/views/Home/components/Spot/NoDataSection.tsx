import React from 'react'
import styled from 'styled-components'
import { Flex } from '@onidex-libs/uikit'

const NoDataSection = ({ text }) => {

  return (
    <Container>
      <p>{text}</p>
    </Container>
  )
}

const Container = styled(Flex)`
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100px;
  color: #FFFFFF;
`
export default NoDataSection;
