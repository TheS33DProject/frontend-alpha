// import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { PageMeta } from 'components/Layout/Page'
import { Button, Flex, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { DisclaimerContainer, StyledSectionContainer, BodyWrapper, StyledTextContainer } from './styles'
import Image from './components/Image'
import pageConfig from './components/config'

const Disclaimer: React.FC = () => {
  // const { account } = useWeb3React()
  const router = useRouter()
  const { t } = useTranslation()
  const { headingText, bodyText, disclaimerIntro, disclaimerC1, disclaimerC2, disclaimerC3, primaryButton, images } =
    pageConfig(t)

  const handleClick = () => {
    router.push('/ido')
  }

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
                <Link href="https://docs.s33d.app/legal-notices/disclaimer">
                  <a href="https://docs.s33d.app/legal-notices/disclaimer" target="_blank" rel="noreferrer">
                    {disclaimerC1}
                  </a>
                </Link>
              </Text>
              <Text color="textSubtle" mb="20px">
                {disclaimerC2}
              </Text>
              <Text color="textSubtle" mb="20px">
                {disclaimerC3}
              </Text>
              <Flex>
                <Button onClick={handleClick}>
                  <Text color="card" bold fontSize="16px">
                    {t(primaryButton.text)}
                  </Text>
                </Button>
              </Flex>
            </StyledTextContainer>
          </BodyWrapper>
        </StyledSectionContainer>
      </DisclaimerContainer>
    </>
  )
}

export default Disclaimer
