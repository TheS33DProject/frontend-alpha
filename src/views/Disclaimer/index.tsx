import { NextLinkFromReactRouter } from 'components/NextLink'
// import { useWeb3React } from '@web3-react/core'
// import useTheme from 'hooks/useTheme'
import { PageMeta } from 'components/Layout/Page'
import { Button, Flex, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { DisclaimerContainer, StyledSectionContainer, BodyWrapper, StyledTextContainer } from './styles'
import Image from './components/Image'
import pageConfig from './components/config'

const Disclaimer: React.FC = () => {
  // const { theme } = useTheme()
  // const { account } = useWeb3React()

  // const { isDark } = useTheme()

  const { t } = useTranslation()
  const { headingText, bodyText, disclaimerIntro, disclaimerC1, disclaimerC2, disclaimerC3, primaryButton, images } =
    pageConfig(t)
  return (
    <>
      <PageMeta />
      <DisclaimerContainer>
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
              <Text color="textSubtle" mb="20px">
                {bodyText}
              </Text>
              <Text color="textSubtle" mb="20px">
                {disclaimerIntro}
              </Text>
              <Text color="textSubtle" mb="20px">
                {disclaimerC1}
              </Text>
              <Text color="textSubtle" mb="20px">
                {disclaimerC2}
              </Text>
              <Text color="textSubtle" mb="20px">
                {disclaimerC3}
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
      </DisclaimerContainer>
    </>
  )
}

export default Disclaimer
