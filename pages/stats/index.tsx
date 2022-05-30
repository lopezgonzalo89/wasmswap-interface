import { styled } from '@stitches/react'
import { AppLayout, PageHeader } from 'components'
import { Card } from 'junoblocks'
import React from 'react'

import { Liquidity } from './charts/Liquidity'

export const Stats = () => {
  return (
    <AppLayout>
      <StyledContainer>
        <PageHeader title="Stats" subtitle={'Blockchain Info '} />
        <Card
          variant="secondary"
          css={{
            backgroundColor: '$colors$black50',
            padding: 20,
            width: 600,
            height: 400,
          }}
        >
          <Liquidity />
        </Card>
      </StyledContainer>
    </AppLayout>
  )
}

export default Stats

const StyledContainer = styled('div', {
  maxWidth: '53.75rem',
  margin: '0 auto',
})
