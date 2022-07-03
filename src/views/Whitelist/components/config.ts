import { ContextApi } from 'contexts/Localization/types'

const pageConfig = (t: ContextApi['t']) => {
  return {
    headingText: t('Whitelisting'),
    body1Text: [
      t(
        'Please fill in the form to start. We require this information to communicate important information about The S33D Project to all our founding gardeners.',
      ),
    ],
    body2Text: t(
      'The S33D Project is committed to protect and respect your privacy and we only use your personal information to facilitate this whitelisting process. If you consent to us contacting you for project updates, please tick the box below.',
    ),
    footerText: t('I agree to receive communications from The S33D Project'),
    primaryButton: {
      to: '/nfts',
      text: t('Continue'),
    },
    images: { basePath: '/images/astronaut/astronaut-input', alt: 'image' },
  }
}

export default pageConfig
