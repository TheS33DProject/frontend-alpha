import { useEffect } from 'react'
import { getInitialS33DRoundAddress } from 'utils/addressHelpers'
import { multicallv2 } from 'utils/multicall'
import { BigNumber } from '@ethersproject/bignumber'
import initialS33DRoundAbi from 'config/abi/initialS33DRound.json'

const useS33DOfferInfos = ({ setCallback }) => {
  useEffect(() => {
    const fetchStaticInfos = async () => {
      try {
        const initialS33DRoundAddress = getInitialS33DRoundAddress()
        const calls = ['buyLimit', 'getPouchBalance', 'offerPrice'].map((method) => ({
          address: initialS33DRoundAddress,
          name: method,
        }))

        const [[currentBuyLimit], [currentPouchBalance], [currentOfferPrice]] = await multicallv2(
          initialS33DRoundAbi,
          calls,
        )

        setCallback({
          buyLimit: BigNumber.from(currentBuyLimit),
          getPouchBalance: BigNumber.from(currentPouchBalance),
          offerPrice: BigNumber.from(currentOfferPrice),
        })
      } catch (e) {
        console.error(e)
      }
    }
    fetchStaticInfos()
  }, [setCallback])
}

export default useS33DOfferInfos
