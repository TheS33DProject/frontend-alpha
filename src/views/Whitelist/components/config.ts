import { ContextApi } from 'contexts/Localization/types'

const pageConfig = (t: ContextApi['t']) => {
  return {
    headingText: t('Whitelisting'),
    introText: [
      t(
        'Please fill in the form to start. We require this information to communicate important information about The S33D Project to all our founding gardeners.',
      ),
    ],
    noticeText: t(
      'The S33D Project shall only use your personal information to facilitate this whitelisting and keep you informed on the progress of this project. Please check the box below if you agree.',
    ),
    consentText: t('I consent to receive emails from The S33D Project'),
    primaryButton: {
      to: '/thank-you',
      text: t('Continue'),
    },
    submitText: t(
      'By clicking Continue, you allow The S33D Project to store and process the personal information submitted above to provide you the content requested.',
    ),
    images: { basePath: '/images/astronaut/astronaut-input', alt: 'image' },
  }
}

export default pageConfig
