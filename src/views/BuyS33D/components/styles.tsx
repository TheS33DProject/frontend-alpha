import { Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'

export const StyledImageContainer = styled(Flex)`
  position: relative;
  z-index: 5;
  flex-shrink: 0;
  justify-content: right;

  & > img {
    height: 100%;
  }
`
export const StyledImage = styled.img``
