import { styled } from '@stitches/react'
import { AppLayout, PageHeader } from 'components'
import { Card } from 'junoblocks'
import React from 'react'

import { Liquidity } from './charts/Liquidity'

export const Stats = (): JSX.Element => {
  return (
    <AppLayout>
      <StyledContainer>
        <PageHeader title="Stats" subtitle={'Blockchain Info '} />
        <StatsContainer>
          <Card
            variant="secondary"
            css={{
              backgroundColor: '$colors$black50',
              padding: 20,
              width: 500,
              height: 400,
            }}
          >
            <Liquidity />
          </Card>
        </StatsContainer>
      </StyledContainer>
    </AppLayout>
  )
}

export default Stats

const StyledContainer = styled('div', {
  display: 'grid',
  justifyContent: 'center',
})

const StatsContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 10,
})

// TODO: set for mobile
export const ChartContainer = styled('div', {
  height: '100%',
  display: 'grid',
  gridTemplateRows: '20% 80%',
  gap: 15,
})

export const InfoContainer = styled('div', {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
})

export const ButtonsGroup = styled('div', {
  marginBottom: 10,
  display: 'flex',
  justifyContent: 'end',
})
