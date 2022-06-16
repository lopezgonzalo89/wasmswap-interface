import { useChainInfo } from 'hooks/useChainInfo'
import { useTokenList } from 'hooks/useTokenList'
import {
  styled,
  Text,
  useControlTheme,
  useMedia,
  usePersistance,
} from 'junoblocks'
import { useEffect, useRef } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import {
  TransactionStatus,
  transactionStatusState,
} from 'state/atoms/transactionAtoms'
import { APP_NAME } from 'util/constants'

import { useTokenToTokenPrice } from '../hooks'
import { tokenSwapAtom } from '../swapAtoms'
import { TokenSelector } from './TokenSelector'
import { TransactionAction } from './TransactionAction'
import { TransactionTips } from './TransactionTips'
type TokenSwapModuleProps = {
  /* will be used if provided on first render instead of internal state */
  initialTokenPair?: readonly [string, string]
}

export const TokenSwapModule = ({ initialTokenPair }: TokenSwapModuleProps) => {
  const { theme } = useControlTheme()

  /* connect to recoil */
  const [[tokenA, tokenB], setTokenSwapState] = useRecoilState(tokenSwapAtom)
  const transactionStatus = useRecoilValue(transactionStatusState)

  /* fetch token list and set initial state */
  const [tokenList, isTokenListLoading] = useTokenList()
  useEffect(() => {
    const shouldSetDefaultTokenAState =
      !tokenA.tokenSymbol && !tokenB.tokenSymbol && tokenList
    if (shouldSetDefaultTokenAState) {
      setTokenSwapState([
        {
          tokenSymbol: tokenList.base_token.symbol,
          amount: tokenA.amount || 0,
        },
        tokenB,
      ])
    }
  }, [tokenList, tokenA, tokenB, setTokenSwapState])

  const initialTokenPairValue = useRef(initialTokenPair).current
  useEffect(
    function setInitialTokenPairIfProvided() {
      if (initialTokenPairValue) {
        const [tokenASymbol, tokenBSymbol] = initialTokenPairValue
        setTokenSwapState([
          {
            tokenSymbol: tokenASymbol,
            amount: 0,
          },
          {
            tokenSymbol: tokenBSymbol,
            amount: 0,
          },
        ])
      }
    },
    [initialTokenPairValue, setTokenSwapState]
  )

  const isUiDisabled =
    transactionStatus === TransactionStatus.EXECUTING || isTokenListLoading
  const uiSize = useMedia('sm') ? 'small' : 'large'

  /* fetch token to token price */
  const [currentTokenPrice, isPriceLoading] = useTokenToTokenPrice({
    tokenASymbol: tokenA?.tokenSymbol,
    tokenBSymbol: tokenB?.tokenSymbol,
    tokenAmount: tokenA?.amount,
  })

  /* persist token price when querying a new one */
  const persistTokenPrice = usePersistance(
    isPriceLoading ? undefined : currentTokenPrice
  )

  /* select token price */
  const tokenPrice =
    (isPriceLoading ? persistTokenPrice : currentTokenPrice) || 0

  const handleSwapTokenPositions = () => {
    setTokenSwapState([
      tokenB ? { ...tokenB, amount: tokenPrice } : tokenB,
      tokenA ? { ...tokenA, amount: tokenB.amount } : tokenA,
    ])
  }

  const [chainInfo] = useChainInfo()
  const chainName = chainInfo?.chainName || APP_NAME

  return (
    <TokenSwapModuleContainer theme={theme.name}>
      <Text variant="header" css={{ paddingTop: '$8' }}>
        Trade
      </Text>
      <Text variant="body" css={{ padding: '$3 $8 $8 0px' }}>
        {`Swap your favorite assets on ${chainName} blockchain.`}
      </Text>
      <StyledDivForWrapper>
        <TokenSelector
          tokenSymbol={tokenA.tokenSymbol}
          amount={tokenA.amount}
          onChange={(updateTokenA) => {
            setTokenSwapState([updateTokenA, tokenB])
          }}
          disabled={isUiDisabled}
          size={uiSize}
        />
        <TransactionTips
          disabled={isUiDisabled}
          isPriceLoading={isPriceLoading}
          tokenToTokenPrice={tokenPrice}
          onTokenSwaps={handleSwapTokenPositions}
          size={uiSize}
        />
        <TokenSelector
          readOnly
          tokenSymbol={tokenB.tokenSymbol}
          amount={tokenPrice}
          onChange={(updatedTokenB) => {
            setTokenSwapState([tokenA, updatedTokenB])
          }}
          disabled={isUiDisabled}
          size={uiSize}
        />
      </StyledDivForWrapper>
      <TransactionAction
        isPriceLoading={isPriceLoading}
        tokenToTokenPrice={tokenPrice}
        size={uiSize}
      />
    </TokenSwapModuleContainer>
  )
}

const TokenSwapModuleContainer = styled('div', {
  padding: '20px',
  borderRadius: '8px',
  border: '1px solid #94cfe0',
  variants: {
    theme: {
      dark: {
        backgroundColor: 'rgb(1, 1, 1, 0.7)',
      },
      light: {
        backgroundColor: 'rgb(255, 255, 255, 0.7)',
      },
    },
  },
})

const StyledDivForWrapper = styled('div', {
  borderRadius: '8px',
  backgroundColor: '$colors$white',
})
