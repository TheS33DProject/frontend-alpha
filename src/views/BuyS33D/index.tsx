import { NextLinkFromReactRouter } from 'components/NextLink'
// import { useWeb3React } from '@web3-react/core'
// import useTheme from 'hooks/useTheme'
import { PageMeta } from 'components/Layout/Page'
import { Button, Flex, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { BuyS33DContainer, StyledSectionContainer, BodyWrapper, StyledTextContainer } from './styles'
import Image from './components/Image'
import pageConfig from './components/config'

const BuyS33D: React.FC = () => {
  // const { theme } = useTheme()
  // const { account } = useWeb3React()

  // const { isDark } = useTheme()

  const { t } = useTranslation()
  const { headingText, bodyText, footerText, primaryButton, images } = pageConfig(t)
  return (
    <>
      <PageMeta />
      <BuyS33DContainer>
        <StyledSectionContainer justifyContent={['flex-start', null, null, 'center']}>
          <BodyWrapper alignItems={['flex-end', null, 'center', null]} flexDirection={['column', null, null, 'row']}>
            <Image basePath={images.basePath} altText={images.alt} />
            <StyledTextContainer
              flexDirection="column"
              alignSelf={['flex-start', null, null, 'center']}
              width={['100%', null, null, '50%']}
            >
              <Heading scale="xl" as="h1" color="primary" mb="20px">
                {headingText}
              </Heading>
              {bodyText.map((text) => (
                <Text key={text} color="textSubtle" mb="20px">
                  {text}
                </Text>
              ))}
              <Text key={footerText} color="textSubtle" mb="20px">
                {footerText}
              </Text>
              <Flex>
                <NextLinkFromReactRouter to={primaryButton.to}>
                  <Button>
                    <Text color="card" bold fontSize="16px">
                      {t(primaryButton.text)}
                    </Text>
                  </Button>
                </NextLinkFromReactRouter>
              </Flex>
            </StyledTextContainer>
          </BodyWrapper>
        </StyledSectionContainer>
      </BuyS33DContainer>
    </>
  )
}

export default BuyS33D
