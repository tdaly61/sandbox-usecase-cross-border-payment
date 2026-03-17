import { createTheme } from '@mui/material';

const TOOLBAR_HEIGHT = 48;

export const logViewerWidth = 368;

export const defaultTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1340,
      xl: 1536,
    },
  },
  palette: {
    primary: {
      main: '#0fb0efff',
      dark: '#0359f7ff',
      light: '#08d7f7ff',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#27D0C7',
    },
    background: {
      paper: '#FFFEFC',
      default: '#FCF9F6',
    },
    text: {
      primary: '#191D16',
      secondary: '#43483F',
      disabled: '#73796E',
    },
    error: {
      main: '#BA1A1A',
    },
    warning: {
      main: '#EF6C00',
    },
    info: {
      main: '#00696C',
    },
    divider: '#C3C8BB',
  },
  typography: {
    allVariants: {
      color: '#191D16',
    },
    fontFamily: 'Inter',
    h1: {
      fontWeight: 300,
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 4,
  },
  components: {
    MuiDrawer: {
      styleOverrides: {
        root: {
          width: 240,
        },
        paper: {
          width: 240,
          backgroundColor: 'inherit',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#d4f5f6ff',
          borderBottom: '1px solid #99c6caff',
          color: '#0359f7ff',
          boxShadow: 'none',
        },
      },
    },
    MuiSvgIcon: {
      styleOverrides: {
        root: {
          color: '#131F0E',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        list: {
          '&[role="menu"]': {
            backgroundColor: '#FCF9F6',
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          border: '1px solid #C3C8BB',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f0f8faff',
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFEFC',
          '& tr:last-child': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #C3C8BB',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: 'none',
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          fontSize: 12,
          ':last-child': {
            paddingRight: 4,
          },
          borderTop: '1px solid #C3C8BB',
        },
        selectLabel: {
          opacity: 0.6,
          fontSize: 'inherit',
        },
        displayedRows: {
          fontSize: 'inherit',
        },
        actions: {
          '& .Mui-disabled svg': {
            color: '#ccc',
          },
        },
      },
    },
    MuiTouchRipple: {
      styleOverrides: {
        child: {
          backgroundColor: '#0fb0efff', // your primary blue color
        },
      },
    },
  },
  mixins: {
    toolbar: {
      height: TOOLBAR_HEIGHT,
      minHeight: TOOLBAR_HEIGHT,
    },
  },
});
