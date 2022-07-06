import { useState } from 'react'
// import { NextLinkFromReactRouter } from 'components/NextLink'
import { useRouter } from 'next/router'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import { useWeb3React } from '@web3-react/core'
import useS33DOfferInfos from 'hooks/useS33DOfferInfos'
import useS33DUserInfos from 'hooks/useS33DUserInfos'
// import useTheme from 'hooks/useTheme'
import { useTranslation } from 'contexts/Localization'
import { PageMeta } from 'components/Layout/Page'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Button, Flex, Heading, Text } from '@pancakeswap/uikit'
import { S33DOfferInfos, S33DUserInfos } from './types'
import Image from './components/Image'
import pageConfig from './components/config'
import { BuyS33DContainer, StyledSectionContainer, BodyWrapper, StyledTextContainer } from './styles'

function admit(whitelist, route) {
  return Number(whitelist) > 0 ? route.passed : route.to
}

const BuyS33D: React.FC = () => {
  // const { theme } = useTheme()
  const { account, library } = useWeb3React()
  // const { isDark } = useTheme()
  const router = useRouter()
  const {
    t,
    currentLanguage: { locale },
  } = useTranslation()
  const { headingText, introText, bodyText, footerText, primaryButton, images } = pageConfig(t)

  const [s33dOfferInfos, setS33DOfferInfos] = useState<S33DOfferInfos>()
  const [s33dUserInfos, setS33DUserInfos] = useState<S33DUserInfos>()

  const handleClick = () => {
    if (s33dUserInfos !== undefined) {
      const whitelist = formatBigNumberToFixed(s33dUserInfos.getWhitelist)
      // console.log("whitelist greater than ", whitelist)
      router.push(admit(whitelist, primaryButton))
    }
    // console.log('handleClick')
  }

  useS33DOfferInfos({ setCallback: setS33DOfferInfos })
  useS33DUserInfos({ account, library, setCallback: setS33DUserInfos })
  // console.log('s33DUserInfos state:', s33dUserInfos)
  // console.log(locale)

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
              <Text key={introText} color="textSubtle" mb="20px">
                {introText}
              </Text>
              <Text key={bodyText} color="textSubtle" mb="20px">
                {bodyText}{' '}
                {s33dOfferInfos !== undefined
                  ? Number(formatBigNumberToFixed(s33dOfferInfos.buyLimit)).toLocaleString(locale)
                  : 0}{' '}
                S33D
              </Text>
              <Text key={footerText} color="textSubtle" mb="20px">
                {footerText}
              </Text>
              <Flex>
                {!account && <ConnectWalletButton mr="8px" />}
                <Button onClick={handleClick} disabled={!account || s33dUserInfos === undefined}>
                  <Text color="card" bold fontSize="16px">
                    {t(primaryButton.text)}
                  </Text>
                </Button>
              </Flex>
            </StyledTextContainer>
          </BodyWrapper>
        </StyledSectionContainer>
      </BuyS33DContainer>
    </>
  )
}

export default BuyS33D
