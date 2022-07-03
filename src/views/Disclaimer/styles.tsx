import { Box, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const DisclaimerContainer = styled(Box)`
  min-height: calc(100vh - 128px);
  background-color: ${({ theme }) => theme.colors.background};
`
export const StyledSectionContainer = styled(Flex)`
  position: relative;
  align-items: center;
  min-height: calc(100vh - 128px);
`
export const BodyWrapper = styled(Flex)`
  max-width: 1200px;
  width: 100%;
  margin: 0 16px;

  ${({ theme }) => theme.mediaQueries.md} {
    margin: 0 40px;
  }
`
export const StyledTextContainer = styled(Flex)`
  z-index: 5;
`
