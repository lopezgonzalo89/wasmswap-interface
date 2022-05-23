import MenuLinks from 'components/MenuLinks/MenuLinks'
import { useConnectWallet } from 'hooks/useConnectWallet'
import { useVersion } from 'hooks/useVersion'
import { Logo } from 'icons'
import {
  Button,
  ChevronIcon,
  Column,
  Discord,
  Divider,
  FeedbackIcon,
  Github,
  IconWrapper,
  Inline,
  media,
  MoonIcon,
  styled,
  Telegram,
  Text,
  ToggleSwitch,
  TreasuryIcon,
  Twitter,
  UnionIcon,
  UpRightArrow,
  useControlTheme,
  useMedia,
} from 'junoblocks'
import Link from 'next/link'
import React, { ReactNode, useState } from 'react'
import { useRecoilState } from 'recoil'
import { walletState, WalletStatusType } from 'state/atoms/walletAtoms'
import { APP_NAME } from 'util/constants'

import { ConnectedWalletButton } from '../ConnectedWalletButton'

type NavigationSidebarProps = {
  shouldRenderBackButton?: boolean
  backButton?: ReactNode
}

export function NavigationSidebar({
  shouldRenderBackButton,
  backButton,
}: NavigationSidebarProps) {
  const { mutate: connectWallet } = useConnectWallet()
  const [{ key }, setWalletState] = useRecoilState(walletState)
  const { version } = useVersion()
  const themeController = useControlTheme()

  const isMobile = useMedia('sm')
  const [isOpen, setOpen] = useState(false)

  function resetWalletConnection() {
    setWalletState({
      status: WalletStatusType.idle,
      address: '',
      key: null,
      client: null,
    })
  }

  const walletButton = (
    <ConnectedWalletButton
      connected={Boolean(key?.name)}
      walletName={key?.name}
      onConnect={() => connectWallet(null)}
      onDisconnect={resetWalletConnection}
      css={{ marginBottom: '$8', color: 'white' }}
    />
  )

  if (isMobile) {
    const triggerMenuButton = isOpen ? (
      <Button
        onClick={() => setOpen(false)}
        icon={<UnionIcon />}
        variant="ghost"
      />
    ) : (
      <Button
        onClick={() => setOpen(true)}
        iconRight={<ChevronIcon rotation="-90deg" />}
        css={{ color: 'white' }}
      >
        Menu
      </Button>
    )

    if (shouldRenderBackButton) {
      return (
        <>
          <StyledWrapperForMobile>
            <Inline align="center" justifyContent="space-between">
              <Column align="flex-start" css={{ flex: 0.3 }}>
                {backButton}
              </Column>

              <Link href="/" passHref>
                <Column
                  css={{ flex: 0.4, color: '$colors$black' }}
                  align="center"
                  as="a"
                >
                  <Logo width="37px" height="47px" />
                </Column>
              </Link>
              <Column align="flex-end" css={{ flex: 0.3 }}>
                {triggerMenuButton}
              </Column>
            </Inline>
            {isOpen && (
              <Column css={{ paddingTop: '$12' }}>
                {walletButton}
                <MenuLinks />
              </Column>
            )}
          </StyledWrapperForMobile>
          <Divider />
        </>
      )
    }

    return (
      <StyledWrapperForMobile>
        <Inline align="center" justifyContent="space-between">
          <Link href="/" passHref>
            <StyledDivForLogo as="a">
              <Logo width="37px" height="47px" />
            </StyledDivForLogo>
          </Link>
          {triggerMenuButton}
        </Inline>
        {isOpen && (
          <Column css={{ paddingTop: '$12' }}>
            {walletButton}
            <MenuLinks />
          </Column>
        )}
      </StyledWrapperForMobile>
    )
  }

  return (
    <StyledWrapper>
      <StyledMenuContainer>
        <Link href="/" passHref>
          <StyledDivForLogo as="a">
            <Logo />
          </StyledDivForLogo>
        </Link>
        <ButtonContainer>{walletButton}</ButtonContainer>
        <MenuLinks />
      </StyledMenuContainer>
      <div>
        <Text variant="legend" css={{ padding: '$4 $3' }}>
          {APP_NAME}
        </Text>
        <Text variant="legend" css={{ padding: '$4 $3' }}>
          {version}
        </Text>
        <br />
        <Inline css={{ display: 'grid' }}>
          <Button
            iconLeft={<MoonIcon />}
            variant="ghost"
            size="large"
            onClick={(e) => {
              if (e.target !== document.querySelector('#theme-toggle')) {
                themeController.toggle()
              }
            }}
            iconRight={
              <ToggleSwitch
                id="theme-toggle"
                name="dark-theme"
                onChange={themeController.setDarkTheme}
                checked={themeController.theme.name === 'dark'}
                optionLabels={['Dark theme', 'Light theme']}
              />
            }
          >
            Dark mode
          </Button>
        </Inline>
        <Divider offsetY="$6" />
        <Column gap={4}>
          <Button
            as="a"
            href={process.env.NEXT_PUBLIC_FEEDBACK_LINK}
            target="__blank"
            variant="ghost"
            size="large"
            iconLeft={<FeedbackIcon />}
            iconRight={<IconWrapper icon={<UpRightArrow />} />}
          >
            Provide feedback
          </Button>
          <Button
            as="a"
            href={process.env.NEXT_PUBLIC_GOVERNANCE_LINK_URL}
            target="__blank"
            variant="ghost"
            size="large"
            iconLeft={<TreasuryIcon />}
            iconRight={<IconWrapper icon={<UpRightArrow />} />}
          >
            {process.env.NEXT_PUBLIC_GOVERNANCE_LINK_LABEL}
          </Button>
        </Column>
        <Inline gap={2} css={{ padding: '$20 0 $13' }}>
          <Button
            as="a"
            href={process.env.NEXT_PUBLIC_DISCORD_LINK}
            target="__blank"
            icon={<IconWrapper icon={<Discord />} />}
            variant="ghost"
            size="medium"
            css={buttonIconCss}
          />
          <Button
            as="a"
            href={process.env.NEXT_PUBLIC_TELEGRAM_LINK}
            target="__blank"
            icon={<IconWrapper icon={<Telegram />} />}
            variant="ghost"
            size="medium"
            css={buttonIconCss}
          />
          <Button
            as="a"
            href={process.env.NEXT_PUBLIC_TWITTER_LINK}
            target="__blank"
            icon={<IconWrapper icon={<Twitter />} />}
            variant="ghost"
            size="medium"
            css={buttonIconCss}
          />
          <Button
            as="a"
            href={process.env.NEXT_PUBLIC_INTERFACE_GITHUB_LINK}
            target="__blank"
            icon={<IconWrapper icon={<Github />} />}
            variant="ghost"
            size="medium"
            css={buttonIconCss}
          />
        </Inline>
      </div>
    </StyledWrapper>
  )
}

const StyledWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '0 $8',
  backgroundColor: '$backgroundColors$base',
  opacity: 0.7,
  overflow: 'auto',
  borderRight: '1px solid $borderColors$inactive',
  position: 'sticky',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  maxHeight: '100vh',
  zIndex: '$1',
})

const StyledWrapperForMobile = styled('div', {
  display: 'block',
  position: 'sticky',
  left: 0,
  top: 0,
  padding: '$10 $12',
  backgroundColor: '$backgroundColors$base',
  zIndex: '$3',
})

const StyledMenuContainer = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  zIndex: '$2',
  padding: '$10 0',
})

const StyledDivForLogo = styled('div', {
  display: 'grid',
  justifyItems: 'center',
  paddingTop: '$4',
  paddingBottom: '$8',

  [media.sm]: {
    paddingBottom: 0,
  },

  variants: {
    size: {
      small: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& [data-logo]': {
          marginBottom: 0,
        },
      },
    },
  },
})

const buttonIconCss = {
  '& svg': {
    color: '$iconColors$tertiary',
  },
}

const ButtonContainer = styled('div', {
  display: 'grid',
  justifyContent: 'center',
})
