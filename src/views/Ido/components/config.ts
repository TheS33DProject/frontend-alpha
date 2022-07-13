import { ContextApi } from 'contexts/Localization/types'

const pageConfig = (t: ContextApi['t']) => {
  return {
    headingText: t('Disclaimer'),
    bodyText: [
      t(
        'The S33D Project is an innovative concept for reimagining the ideas and our relationship with nature and our planet. We are on a mission to enable the propagation of sustainability initiatives and encourage humankind to form symbiotic relationships with our planet and each other.',
      ),
    ],
    disclaimerIntro: t(
      'You understand that by participating the Initial DEX Offering (IDO) of The S33D Project, you have:',
    ),
    disclaimerC1: t('(I) read the Legal Notice and other information about this IDO'),
    disclaimerC2: t(
      '(II) confirmed that you are not in a jurisdiction where buying, trading and/or owning S33D token would be prohibited or restricted in any manner.',
    ),
    disclaimerC3: t(
      '(III) understood that despite all precautions, there can still be exploit risks that exist within the app which may result in partial or total loss of funds.',
    ),
    primaryButton: {
      to: '/nfts',
      text: t('Accept'),
    },
    images: { basePath: '/images/astronaut/astronaut-readme', alt: 'image' },
  }
}

export default pageConfig
