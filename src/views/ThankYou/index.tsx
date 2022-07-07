import { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useRouter } from 'next/router'
import { formatBigNumberToFixed } from 'utils/formatBalance'
import useS33DUserInfos from 'hooks/useS33DUserInfos'
import { PageMeta } from 'components/Layout/Page'
import { Button, Flex, Heading, Text } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { S33DUserInfos } from './types'
import { ThankYouContainer, StyledSectionContainer, BodyWrapper, StyledTextContainer } from './styles'
import Image from './components/Image'
import pageConfig from './components/config'

function admit(whitelist) {
  return Number(whitelist) > 0 ? '/disclaimer' : '/'
}

const ThankYou: React.FC = () => {
  const { account, library } = useWeb3React()
  const router = useRouter()
  const { t } = useTranslation()
  const { headingText, body1Text, footerText, primaryButton, images } = pageConfig(t)
  const [s33dUserInfos, setS33DUserInfos] = useState<S33DUserInfos>()
  useS33DUserInfos({ account, library, setCallback: setS33DUserInfos })
  // console.log('s33DUserInfos state:', s33dUserInfos)

  const handleClick = () => {
    const whitelist = formatBigNumberToFixed(s33dUserInfos.getWhitelist)
    router.push(admit(whitelist))
  }

  return (
    <>
      <PageMeta />
      <ThankYouContainer>
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
                {body1Text}
              </Text>
              {/* <Text color="textSubtle" mb="20px">
                {body2Text}
              </Text> */}
              <Text key={footerText} color="textSubtle" mb="20px">
                {footerText}
              </Text>
              <Flex>
                <Button onClick={handleClick} disabled={s33dUserInfos === undefined}>
                  <Text color="card" bold fontSize="16px">
                    {t(primaryButton.text)}
                  </Text>
                </Button>
              </Flex>
            </StyledTextContainer>
          </BodyWrapper>
        </StyledSectionContainer>
      </ThankYouContainer>
    </>
  )
}

export default ThankYou
