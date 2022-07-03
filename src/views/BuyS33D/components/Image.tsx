/* eslint-disable react/no-array-index-key */
import { StyledImage, StyledImageContainer } from './styles'

type Image = {
  basePath: string
  altText: string
}

const Image: React.FC<Image> = ({ basePath, altText }) => {
  return (
    <StyledImageContainer
      mb={[null, null, null, '-3px']}
      mr={['0', null, null, '64px']}
      width={['192px', null, '250px', '400px', '512px']}
      height={['192px', null, '250px', '400px', '512px']}
    >
      <StyledImage src={`${basePath}.png`} alt={`${altText}`} />
    </StyledImageContainer>
  )
}

export default Image
