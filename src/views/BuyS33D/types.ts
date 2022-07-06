import { BigNumber } from '@ethersproject/bignumber'

export type S33DOfferInfos = {
  buyLimit: BigNumber
  getPouchBalance: BigNumber
  offerPrice: BigNumber
}

export type S33DUserInfos = {
  contribution: BigNumber
  getS33DBalance: BigNumber
  getUSDTBalance: BigNumber
  getWhitelist: BigNumber
}
