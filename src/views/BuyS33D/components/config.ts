import { ContextApi } from 'contexts/Localization/types'

const pageConfig = (t: ContextApi['t']) => {
  return {
    headingText: t('Buy S33D'),
    bodyText: [
      t('We are delighted that you share the vision and dreams of creating a new future with us.'),
      t(
        'Our first goal is to raise $1,000,000 and you’re invited to participate as founding gardeners at S33D. To ensure a fair distribution in this first launch, each participant can acquire a maximum of  ',
      ),
    ],
    footerText: t('Please connect your wallet on Binance Smart Chain to begin.'),
    primaryButton: {
      to: '/nfts',
      text: t('Continue'),
    },
    images: { basePath: '/images/astronaut/astronaut-money', alt: 'image' },
  }
}

export default pageConfig
