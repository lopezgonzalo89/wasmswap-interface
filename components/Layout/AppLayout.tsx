import { media, styled, useControlTheme, useMedia } from 'junoblocks'
import lightBackground from 'public/img/sourceswap-bg-day.svg'
import nightBackground from 'public/img/sourceswap-bg-night.svg'
import { APP_MAX_WIDTH } from 'util/constants'

import { FooterBar } from './FooterBar'
import { NavigationSidebar } from './NavigationSidebar'

export const AppLayout = ({
  navigationSidebar = <NavigationSidebar />,
  footerBar = <FooterBar />,
  children,
}) => {
  const themeController = useControlTheme()
  const isSmallScreen = useMedia('sm')

  if (isSmallScreen) {
    return (
      <StyledWrapperForMobile theme={themeController.theme.name}>
        <StyledContainerForMobile>
          {navigationSidebar}

          <main data-content="">{children}</main>
        </StyledContainerForMobile>

        <StyledContainerForMobile>
          <div data-content="">{footerBar}</div>
        </StyledContainerForMobile>
      </StyledWrapperForMobile>
    )
  }

  return (
    <StyledWrapper theme={themeController.theme.name}>
      {navigationSidebar}

      <StyledContainer>
        <main>{children}</main>
      </StyledContainer>
    </StyledWrapper>
  )
}

const StyledWrapper = styled('div', {
  display: 'grid',
  minHeight: '100vh',
  gridTemplateColumns: '16.5rem 1fr 16.5rem',
  maxWidth: APP_MAX_WIDTH,
  margin: '0 auto',
  [media.md]: {
    gridTemplateColumns: '15rem 1fr',
  },
  backgroundPosition: 'right bottom',
  variants: {
    theme: {
      dark: {
        backgroundImage: `url(${nightBackground.src})`,
      },
      light: {
        backgroundImage: `url(${lightBackground.src})`,
      },
    },
  },
})

const StyledContainer = styled('div', {
  position: 'relative',
  zIndex: '$2',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '0 $12 $20 $12',
  '& main': {
    margin: '0 auto',
    width: '100%',
    maxWidth: '69.5rem',
  },
  [media.sm]: {
    zIndex: '$1',
  },
})

const StyledWrapperForMobile = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  minHeight: '100vh',
  backgroundPosition: 'right bottom',
  variants: {
    theme: {
      dark: {
        backgroundImage: `url(${nightBackground.src})`,
      },
      light: {
        backgroundImage: `url(${lightBackground.src})`,
      },
    },
  },
})

const StyledContainerForMobile = styled('div', {
  position: 'relative',
  zIndex: '$1',
  '& [data-content]': {
    margin: '0 auto',
    width: '100%',
    padding: '0 $12',
  },
})
