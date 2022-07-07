import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import axios from 'axios'
import Router from 'next/router'
import { ToastContainer } from 'components/Toast'
import { PageMeta } from 'components/Layout/Page'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { Button, Flex, Heading, Text, Input, Checkbox } from '@pancakeswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { WhitelistForm } from './types'
import { WhitelistContainer, StyledSectionContainer, BodyWrapper, StyledTextContainer } from './styles'
import Image from './components/Image'
import pageConfig from './components/config'

function validateField(type: string, data: any) {
  if (type === 'firstname') {
    return /^[a-z ,.'-]+$/i.test(data)
  }
  if (type === 'lastname') {
    return /^[a-z ,.'-]+$/i.test(data)
  }
  if (type === 'email') {
    return /.+@.+\.[A-Za-z]{2,}$/.test(data)
  }
  return false
}

function checkForm(userDetails: WhitelistForm) {
  const formStatus =
    validateField('firstname', userDetails.firstname) &&
    validateField('lastname', userDetails.lastname) &&
    validateField('email', userDetails.email) &&
    userDetails.consent &&
    userDetails.walletaddress !== undefined
  return formStatus
}

function formatPayload(data: WhitelistForm, consent: any) {
  const payload = {
    fields: [],
    legalConsentOptions: {},
  }
  const keys = Object.keys(data)

  keys.forEach((element) => {
    const temp = { objectTypeID: '0-1', name: '', value: '' }
    if (element === 'consent') {
      // console.log('consent key', data[element])
      const consentForm = {
        consent: {
          consentToProcess: data[element],
          // Boolean; Whether or not the visitor checked the Consent to process checkbox
          text: consent.submitText,
          // String; The text displayed to the visitor for the Consent to process checkbox
          communications: [
            // A list of details for the Consent to communicate for each subscription type included in the form
            {
              value: data[element],
              // Boolean; Whether or not the visitor checked the checkbox for this subscription type.
              subscriptionTypeId: 44459851,
              // Integer; The ID of the specific subscription type
              text: consent.consentText,
              // String; The text displayed to the visitor for this specific subscription checkbox
            },
          ],
        },
      }
      payload.legalConsentOptions = consentForm
    } else {
      temp.name = element
      temp.value = data[element]
      payload.fields.push(temp)
    }
  })
  return payload
}

const Whitelist: React.FC = () => {
  // const { theme } = useTheme()
  const { account } = useWeb3React()
  const { t } = useTranslation()
  const { headingText, introText, noticeText, consentText, submitText, primaryButton, images } = pageConfig(t)
  const [formComplete, setFormComplete] = useState(false)
  const [toasts, setToasts] = useState([])
  const [userDetails, setUserDetails] = useState<WhitelistForm>({
    firstname: '',
    lastname: '',
    email: '',
    consent: false,
    walletaddress: '',
  })

  useEffect(() => {
    if (account) {
      userDetails.walletaddress = account
      setFormComplete(checkForm(userDetails))
    } else {
      userDetails.walletaddress = undefined
      setFormComplete(false)
    }
  }, [account, userDetails])

  const onChange = (e) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.name === 'consent' ? e.target.checked : e.target.value,
    })
  }

  const handleRemove = (id: string) => {
    setToasts((prevToasts) => prevToasts.filter((prevToast) => prevToast.id !== id))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const consent = { consentText, submitText }
    if (checkForm(userDetails)) {
      submitForm(consent)
      // console.log('submitResult:', result)
    }
  }

  const submitForm = async (consent) => {
    try {
      const data = { ...userDetails }
      data['TICKET.subject'] = `S33D whitelist ${userDetails.email}|${userDetails.walletaddress}`
      data['TICKET.content'] = 'Contact requests for whitelisting to participate in Buy S33D round.'
      const payload = formatPayload(data, consent)
      // console.log('payload:', payload)
      // console.log('consent:', consent)
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const result = await axios.post(
        'https://api.hsforms.com/submissions/v3/integration/submit/22081730/1f8c1946-16e7-44fd-b034-bf63c7476706',
        payload,
        config,
      )
      // console.log('result:', result)
      if (result.status === 200) {
        localStorage.setItem(data.walletaddress, JSON.stringify({ whitelistForm: true }))
        Router.push({ pathname: '/thank-you' })
      }
    } catch (error) {
      const now = Date.now()
      const randomToast = {
        id: `id-${now}`,
        title: error.name,
        type: 'danger',
        description: error.message,
      }
      setToasts((prevState) => [...prevState, randomToast])
    }
  }

  return (
    <>
      <PageMeta />
      <WhitelistContainer>
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
                {introText}
              </Text>
              <form id="whitelistForm" onSubmit={handleSubmit}>
                <Flex flexDirection="column" mb="20px">
                  <Flex flexDirection={['column', null, 'row', null]} alignItems={['stretch', null, null, 'center']}>
                    <Flex
                      flex={[null, null, '1', null]}
                      mr={[null, null, '10px', null]}
                      mb={['10px', null, null, '0px']}
                    >
                      <Input
                        type="text"
                        scale="lg"
                        placeholder="First Name"
                        name="firstname"
                        onChange={onChange}
                        isSuccess={validateField('firstname', userDetails.firstname)}
                        isWarning={!validateField('firstname', userDetails.firstname)}
                      />
                    </Flex>
                    <Flex flex={[null, null, 1, 'null']} ml={[null, null, '10px', null]}>
                      <Input
                        type="text"
                        scale="lg"
                        placeholder="Last Name"
                        name="lastname"
                        onChange={onChange}
                        isSuccess={validateField('lastname', userDetails.lastname)}
                        isWarning={!validateField('lastname', userDetails.lastname)}
                      />
                    </Flex>
                  </Flex>
                  <Flex flexDirection="column" mt={['10px', null, null, '20px']}>
                    <Input
                      type="email"
                      scale="lg"
                      name="email"
                      placeholder="Email Address"
                      onChange={onChange}
                      isSuccess={validateField('email', userDetails.email)}
                      isWarning={!validateField('email', userDetails.email)}
                    />
                  </Flex>
                </Flex>
                <Text color="textSubtle" mb="20px">
                  {noticeText}
                </Text>
                <Flex flexDirection="row" alignItems="center" mb="10px">
                  <Checkbox name="consent" onChange={onChange} />
                  <Text key={consentText} color="textSubtle" ml="10px">
                    {consentText}
                  </Text>
                </Flex>
                <Text key={submitText} color="textSubtle" mb="24px">
                  {submitText}
                </Text>
                <Flex>
                  {!account && <ConnectWalletButton mr="8px" />}{' '}
                  <Button type="submit" disabled={!formComplete}>
                    <Text color="card" bold fontSize="16px">
                      {t(primaryButton.text)}
                    </Text>
                  </Button>
                </Flex>
              </form>
            </StyledTextContainer>
          </BodyWrapper>
        </StyledSectionContainer>
      </WhitelistContainer>
      <ToastContainer toasts={toasts} onRemove={handleRemove} />
    </>
  )
}

export default Whitelist
