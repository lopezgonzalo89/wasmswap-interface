import { Text } from 'junoblocks'
import Image from 'next/image'
import logo from 'public/img/source-s-only-logo.svg'
import { __TEST_MODE__ } from 'util/constants'

type LogoProps = {
  width?: string | number
  height?: string | number
}

export const Logo = ({ width, height }: LogoProps): JSX.Element => {
  return (
    <>
      <Image
        src={logo}
        width={width}
        height={height}
        alt="Source Logo"
        loader={({ src }) => {
          return src
        }}
      />
      <Text variant={'hero'} color={'valid'} style={{ margin: 5 }}>
        SOURCE
      </Text>
      <Text variant="caption" color="error">
        {__TEST_MODE__ && 'Testnet'}
      </Text>
    </>
  )
}
