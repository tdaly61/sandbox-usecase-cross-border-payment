import { Box, Icon, IconButton, useTheme } from '@mui/material';
import React from 'react';

import { Drawer } from '@/components/ui/drawer/drawer';
import { logViewerWidth } from '@/config/theme';
// eslint-disable-next-line import/no-restricted-paths
import { LogViewer } from '@/features/broadcast/log-viewer';

type SidebarLogViewerProps = {
  isLogViewerOpen: boolean;
  toggleLogViewer: () => void;
};

export const SidebarLogViewer = ({ isLogViewerOpen, toggleLogViewer }: SidebarLogViewerProps) => {
  const theme = useTheme();

  return (
    <>
      <Box
        sx={{
          position: 'fixed',
          right: isLogViewerOpen ? logViewerWidth : 0,
          top: 49,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'right'], {
            easing: theme.transitions.easing.sharp,
            duration: isLogViewerOpen
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
          borderRadius: '100px 0px 0px 100px',
          opacity: isLogViewerOpen ? 1 : 0.4,
          background: isLogViewerOpen ? '#03202E' : '#062736',
          color: 'white',
          boxShadow: 6,
        }}
      >
        <IconButton sx={{ color: 'inherit', p: 2 }} onClick={toggleLogViewer} disableRipple>
          <Icon baseClassName="material-symbols-outlined">code</Icon>
        </IconButton>
      </Box>
      <Drawer
        openwidth={`${logViewerWidth}px`}
        variant="permanent"
        anchor="right"
        open={isLogViewerOpen}
        sx={{
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            boxSizing: 'border-box',
            overflowX: 'hidden',
            borderLeft: isLogViewerOpen ? '1px solid rgba(0, 0, 0, 0.12)' : 'none',
            background:
              'linear-gradient(93deg, #03202E 0%, #0D384C 25.9%, #0D384C 73.4%, #03202E 100%)',
            boxShadow: isLogViewerOpen ? 12 : 'none',
          },
        }}
        ModalProps={{
          keepMounted: false,
        }}
      >
        <LogViewer toggleLogViewer={toggleLogViewer} />
      </Drawer>
    </>
  );
};
