import { TranslateFunction } from 'contexts/Localization/types'
import { IntroSectionProps } from '.'

export const growFoodData = (t: TranslateFunction): IntroSectionProps => ({
  headingText: t('Grow Food'),
  bodyText: t('Get funded by locals to start your passion for growing loved fruits of labor.'),
  reverse: true,
  primaryButton: {
    to: '/buy-s33d',
    text: t('Buy S33D'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.s33d.app/about/goals/food-supply',
    text: t('Learn How'),
    external: true,
  },
  images: {
    path: '/images/home/grow/',
    attributes: [
      { src: 'VERT', alt: t('Vertical farming') },
      { src: 'FREE', alt: t('Free range & organic') },
      { src: 'SOIL', alt: t('Land farming') },
    ],
  },
})

export const fundCausesData = (t: TranslateFunction): IntroSectionProps => ({
  headingText: t('Fund Causes'),
  bodyText: t(
    'Mobilise funds to reach the causes that matter to you. Let the planet be a little better to live in when funds go to where it matters.',
  ),
  reverse: false,
  primaryButton: {
    to: '/buy-s33d',
    text: t('Buy S33D'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.s33d.app/about/goals/resource-preservation',
    text: t('Learn'),
    external: true,
  },
  images: {
    path: '/images/home/fund/',
    attributes: [
      { src: 'fund3light', alt: t('Pie chart') },
      { src: 'fund2light', alt: t('Stocks chart') },
      { src: 'fund1light', alt: t('Folder with cake token') },
    ],
  },
})

export const cakeSectionData = (t: TranslateFunction): IntroSectionProps => ({
  headingText: t('CAKE makes our world go round.'),
  bodyText: t(
    'CAKE token is at the heart of the PancakeSwap ecosystem. Buy it, win it, farm it, spend it, stake it... heck, you can even vote with it!',
  ),
  reverse: false,
  primaryButton: {
    to: '/swap?outputCurrency=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    text: t('Buy CAKE'),
    external: false,
  },
  secondaryButton: {
    to: 'https://docs.s33d.app/tokenomics/s33d',
    text: t('Learn'),
    external: true,
  },

  images: {
    path: '/images/home/cake/',
    attributes: [
      { src: 'bottom-right', alt: t('Small 3d pancake') },
      { src: 'top-right', alt: t('Small 3d pancake') },
      { src: 'coin', alt: t('CAKE token') },
      { src: 'top-left', alt: t('Small 3d pancake') },
    ],
  },
})
