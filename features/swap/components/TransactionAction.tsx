import { useConnectWallet } from 'hooks/useConnectWallet'
import { useTokenBalance } from 'hooks/useTokenBalance'
import { Button, Inline, Spinner, styled, Text } from 'junoblocks'
import React, { useEffect, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'
import { NETWORK_FEE } from 'util/constants'

import { useTokenSwap } from '../hooks'
import { slippageAtom, tokenSwapAtom } from '../swapAtoms'
import { SlippageSelector } from './SlippageSelector'

type TransactionTipsProps = {
  isPriceLoading?: boolean
  tokenToTokenPrice?: number
  size?: 'small' | 'large'
}

export const TransactionAction = ({
  isPriceLoading,
  tokenToTokenPrice,
  size = 'large',
}: TransactionTipsProps) => {
  const [requestedSwap, setRequestedSwap] = useState(false)
  const [tokenA, tokenB] = useRecoilValue(tokenSwapAtom)
  const { balance: tokenABalance } = useTokenBalance(tokenA?.tokenSymbol)

  /* wallet state */
  const { status } = useRecoilValue(walletState)
  const { mutate: connectWallet } = useConnectWallet()
  const [slippage, setSlippage] = useRecoilState(slippageAtom)

  const { mutate: handleSwap, isLoading: isExecutingTransaction } =
    useTokenSwap({
      tokenASymbol: tokenA?.tokenSymbol,
      tokenBSymbol: tokenB?.tokenSymbol,
      tokenAmount: tokenA?.amount,
      tokenToTokenPrice: tokenToTokenPrice || 0,
    })

  /* proceed with the swap only if the price is loaded */

  useEffect(() => {
    const shouldTriggerTransaction =
      !isPriceLoading && !isExecutingTransaction && requestedSwap
    if (shouldTriggerTransaction) {
      handleSwap()
      setRequestedSwap(false)
    }
  }, [isPriceLoading, isExecutingTransaction, requestedSwap, handleSwap])

  const handleSwapButtonClick = () => {
    if (status === WalletStatusType.connected) {
      return setRequestedSwap(true)
    }

    connectWallet(null)
  }

  const shouldDisableSubmissionButton =
    isExecutingTransaction ||
    !tokenB.tokenSymbol ||
    !tokenA.tokenSymbol ||
    status !== WalletStatusType.connected ||
    tokenA.amount <= 0 ||
    tokenA?.amount > tokenABalance

  if (size === 'small') {
    return (
      <>
        <Inline css={{ display: 'grid', padding: '$6 0' }}>
          <SlippageSelector
            slippage={slippage}
            onSlippageChange={setSlippage}
            css={{ width: '100%' }}
          />
        </Inline>
        <Inline
          justifyContent="space-between"
          css={{
            padding: '$8 $12',
            backgroundColor: '$colors$dark10',
            borderRadius: '$1',
          }}
        >
          <Text variant="legend" transform="uppercase">
            Swap fee
          </Text>
          <Text variant="legend">{NETWORK_FEE * 100}%</Text>
        </Inline>
        <Inline css={{ display: 'grid', paddingTop: '$8' }}>
          <Button
            variant="primary"
            size="large"
            disabled={shouldDisableSubmissionButton}
            onClick={
              !isExecutingTransaction && !isPriceLoading
                ? handleSwapButtonClick
                : undefined
            }
            style={{
              background:
                'linear-gradient(108.7deg,  #960ead 12%,#0ad8c7 100%)',
              color: 'white',
            }}
          >
            {isExecutingTransaction ? <Spinner instant /> : 'Swap'}
          </Button>
        </Inline>
      </>
    )
  }

  return (
    <StyledDivForWrapper>
      <StyledDivForInfo>
        <StyledDivColumnForInfo kind="slippage">
          <SlippageSelector
            slippage={slippage}
            onSlippageChange={setSlippage}
            css={{ borderRadius: '$2' }}
          />
        </StyledDivColumnForInfo>
        <StyledDivColumnForInfo kind="fees">
          <Text variant="legend">Swap fee ({NETWORK_FEE * 100}%)</Text>
        </StyledDivColumnForInfo>
      </StyledDivForInfo>
      <Button
        variant="primary"
        size="large"
        disabled={shouldDisableSubmissionButton}
        onClick={
          !isExecutingTransaction && !isPriceLoading
            ? handleSwapButtonClick
            : undefined
        }
        style={{
          background: 'linear-gradient(108.7deg,  #960ead 12%,#0ad8c7 100%)',
          color: 'white',
        }}
      >
        {isExecutingTransaction ? <Spinner instant /> : 'Swap'}
      </Button>
    </StyledDivForWrapper>
  )
}

const StyledDivForWrapper = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 150px',
  columnGap: 12,
  alignItems: 'center',
  padding: '12px 0',
})

const StyledDivForInfo = styled('div', {
  display: 'grid',
  gridTemplateColumns: 'auto auto',
  justifyContent: 'right',
  textTransform: 'uppercase',
})

const StyledDivColumnForInfo = styled('div', {
  display: 'grid',
  variants: {
    kind: {
      slippage: {
        minWidth: '140px',
      },
      fees: {
        padding: '$space$8 $space$12 0px 0px',
      },
    },
  },
})
