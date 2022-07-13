import { Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledImageContainer = styled(Flex)`
  position: relative;
  z-index: 5;
  flex-shrink: 0;
  justify-content: right;
`
export const StyledImage = styled.img`
  object-fit: contain;
`