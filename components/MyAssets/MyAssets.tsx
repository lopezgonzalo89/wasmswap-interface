import { media, styled, Text } from 'junoblocks'
import React from 'react'

const columns = [
  {
    id: 'total',
    label: 'Total',
  },
  {
    id: 'available',
    label: 'Available',
  },
  {
    id: 'bonded',
    label: 'Bonded',
  },
  {
    id: 'staked',
    label: 'Staked SOURCE',
  },
]

// TODO: rm mock and get real values
const rows = [
  {
    id: 'total',
    label: '$13.500',
  },
  {
    id: 'available',
    label: '$100',
  },
  {
    id: 'bonded',
    label: '$5.000',
  },
  {
    id: 'staked',
    label: '$8.400',
  },
]

export const MyAssets = () => {
  return (
    <MyAssetsContainer>
      <Text variant={'title'}>My Source Assets</Text>
      <Table>
        {columns.map(({ id, label }) => {
          return (
            <Text key={id} variant={'primary'} color={'violet'}>
              {label}
            </Text>
          )
        })}
        {rows.map(({ id, label }) => {
          return (
            <Text key={id} variant={'primary'}>
              {label}
            </Text>
          )
        })}
      </Table>
    </MyAssetsContainer>
  )
}

export default MyAssets

const MyAssetsContainer = styled('div', {
  marginTop: 90,
  marginBottom: 70,
  height: 125,
  padding: 15,
  borderRadius: '8px',
  border: '1px solid #94cfe0',
  [media.sm]: {
    marginTop: 20,
    marginBottom: 20,
  },
})

const Table = styled('div', {
  display: 'grid',
  gridTemplateRows: '1fr 1fr',
  gridTemplateColumns: ' repeat(4, 1fr)',
  alignItems: 'center',
  paddingTop: 10,
  height: '80%',
})
