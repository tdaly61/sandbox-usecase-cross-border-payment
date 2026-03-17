import {
  CSSObject,
  Drawer as MuiDrawer,
  styled,
  Theme,
  DrawerProps as MuiDrawerProps,
} from '@mui/material';
import React from 'react';

type DrawerProps = MuiDrawerProps & {
  openwidth: string;
  closedwidth?: string;
};

const openedMixin = (theme: Theme, width: string): CSSObject => ({
  width,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme, width: string): CSSObject => ({
  width,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
});

const StyledDrawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open' && prop !== 'width',
})<{ open: boolean; openwidth: string; closedwidth: string }>(
  ({ theme, open, openwidth, closedwidth }) => ({
    width: openwidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme, openwidth),
      '& .MuiDrawer-paper': openedMixin(theme, openwidth),
    }),
    ...(!open && {
      ...closedMixin(theme, closedwidth),
      '& .MuiDrawer-paper': closedMixin(theme, closedwidth),
    }),
  }),
);

export const Drawer = ({
  open = true,
  openwidth,
  closedwidth = '0',
  children,
  ...other
}: DrawerProps) => {
  return (
    <StyledDrawer open={open} openwidth={openwidth} closedwidth={closedwidth} {...other}>
      {children}
    </StyledDrawer>
  );
};
