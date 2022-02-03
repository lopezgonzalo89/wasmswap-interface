import { useMutation } from 'react-query'
import { stakeTokens } from '../services/staking'
import { useSwapInfo } from './useSwapInfo'
import { useTokenInfoByPoolId } from './useTokenInfo'
import { useRecoilValue } from 'recoil'
import { walletState } from '../state/atoms/walletAtoms'

type UseBondTokensArgs = {
  poolId: string
} & Parameters<typeof useMutation>[2]

export const useBondTokens = ({ poolId, ...options }: UseBondTokensArgs) => {
  const token = useTokenInfoByPoolId(poolId)
  const { address, client } = useRecoilValue(walletState)
  const [swap] = useSwapInfo({ poolId })

  return useMutation(async (amount: number) => {
    return stakeTokens(
      address,
      token.staking_address,
      swap.lp_token_address,
      amount,
      client
    )
  }, options)
}