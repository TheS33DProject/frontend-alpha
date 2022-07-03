import { ContextApi } from 'contexts/Localization/types'

const pageConfig = (t: ContextApi['t']) => {
  return {
    headingText: t('Thank You'),
    body1Text: [
      t(
        'We appreciate your support in our project. Please allow us up to 48 hours to process your whitelisting request. You will receive an email from us to confirm your whitelisting and the next steps!',
      ),
    ],
    body2Text: t(''),
    footerText: t(
      'In the meantime, please follow us on the social media channels below for more updates and active discussions.',
    ),
    primaryButton: {
      to: '/nfts',
      text: t('Continue'),
    },
    images: { basePath: '/images/astronaut/astronaut-thankyou', alt: 'image' },
  }
}

export default pageConfig
