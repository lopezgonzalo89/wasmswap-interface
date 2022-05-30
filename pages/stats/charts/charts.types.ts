/*
  FIXME: Token key only accepted number
  but typescript doesn't allow it
  https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures
*/
export type Data = Item & {
  [token: string]: number | string
}

export type Filter = {
  id: string
  values: Array<{ id: string; label: string }>
  // eslint-disable-next-line no-unused-vars
  callback: (values: string) => void
}

export type Currency = { value: string; before: boolean }

export type Item = {
  time: null | string
  value: null | number
}
export type Price = {
  price: string
  date: string
}

export type LiquidityInfoType = {
  title: string
  range: string
  data: Data
  currency: Currency
}

export type ChartLiquidityType = {
  data: Data[]
  crossMove: React.Dispatch<React.SetStateAction<Item>>
  onMouseLeave: () => void
}
