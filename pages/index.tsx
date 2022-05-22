import { AppLayout } from 'components'
import MyAssets from 'components/MyAssets/MyAssets'
import { TokenSwapModule } from 'features/swap'
import { styled } from 'junoblocks'
import React from 'react'

function getInitialTokenPairFromSearchParams() {
  const params = new URLSearchParams(location.search)
  const from = params.get('from')
  const to = params.get('to')
  return from || to ? ([from, to] as const) : undefined
}

export default function Home() {
  return (
    <AppLayout>
      <StyledContainer>
        <MyAssets />
        <TokenSwapModule
          initialTokenPair={getInitialTokenPairFromSearchParams()}
        />
      </StyledContainer>
    </AppLayout>
  )
}

const StyledContainer = styled('div', {
  maxWidth: '53.75rem',
  margin: '0 auto',
})
