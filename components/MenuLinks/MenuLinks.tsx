import { Address, ArrowUp, Button, IconWrapper, Open, styled } from 'junoblocks'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const links = [
  {
    id: 'home',
    label: 'Trade',
    href: '/',
    icon: <Address />,
  },
  {
    id: 'transfer',
    label: 'Transfer',
    href: '/transfer',
    icon: <ArrowUp />,
  },
  {
    id: 'pools',
    label: 'Liquidity Pools',
    href: '/pools',
    icon: <Open />,
  },
]

export const MenuLinks = () => {
  const { pathname } = useRouter()
  const getIsLinkActive = (path) => pathname === path

  type LinksProps = {
    id: string
    label: string
    href: string
    icon: JSX.Element
  }

  return (
    <StyledListForLinks>
      {links.map(({ id, label, href, icon }: LinksProps) => {
        return (
          <Link key={id} href={href} passHref>
            <Button
              as="a"
              variant="menu"
              size="large"
              iconLeft={<IconWrapper icon={icon} />}
              selected={getIsLinkActive(href)}
            >
              {label}
            </Button>
          </Link>
        )
      })}
    </StyledListForLinks>
  )
}

export default MenuLinks

const StyledListForLinks = styled('div', {
  display: 'flex',
  rowGap: '$space$2',
  flexDirection: 'column',
})
