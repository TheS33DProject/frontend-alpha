import { useEffect } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { getInitialS33DRoundContract } from 'utils/contractHelpers'
// import { getInitialS33DRoundAddress } from 'utils/addressHelpers'
// import { multicallv2 } from 'utils/multicall'
// import initialS33DRoundAbi from 'config/abi/initialS33DRound.json'
import { getProviderOrSigner } from '../utils'

const useS33DUserInfos = ({ account, library, setCallback }) => {
  useEffect(() => {
    const fetchS33DUserInfos = async () => {
      try {
        // const initialS33DRoundAddress = getInitialS33DRoundAddress()
        const initialS33DRoundContract = getInitialS33DRoundContract(getProviderOrSigner(library, account))

        if (account) {
          // const calls = [
          //   'contribution',
          // ].map((method) => ({
          //   address: initialS33DRoundAddress,
          //   name: method,
          //   params: method === 'contribution' ? [account]:[account]
          // }))

          // const [
          //   [currentContribution],
          // ] = await multicallv2(initialS33DRoundAbi, calls)
          // console.log("current contribution:", currentContribution)
          const contribution = await initialS33DRoundContract.contribution(account)
          // console.log("contribution:", contribution)
          // const s33dBalance = await initialS33DRoundContract.getS33DBalance()
          // console.log("s33dBalance:", s33dBalance)
          // const usdtBalance = await initialS33DRoundContract.getUSDTBalance()
          // console.log("usdtBalance:", usdtBalance)
          const whitelist = await initialS33DRoundContract.getWhitelist()
          // console.log("whitelist:", whitelist)
          setCallback({
            contribution: BigNumber.from(contribution),
            // getS33DBalance: BigNumber.from(s33dBalance),
            // getUSDTBalance: BigNumber.from(usdtBalance),
            getWhitelist: BigNumber.from(whitelist),
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchS33DUserInfos()
  }, [account, library, setCallback])
}

export default useS33DUserInfos
