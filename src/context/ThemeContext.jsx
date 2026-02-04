import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { createTheme } from '@mui/material';

const ThemeContext = createContext();

// Light theme palette
const lightPalette = {
  mode: 'light',
  primary: {
    main: '#2E75B6',
    light: '#5a9fd4',
    dark: '#1a4971',
  },
  secondary: {
    main: '#44546A',
  },
  success: {
    main: '#4caf50',
  },
  warning: {
    main: '#ff9800',
  },
  error: {
    main: '#f44336',
  },
  background: {
    default: '#f5f5f5',
    paper: '#ffffff',
  },
  text: {
    primary: '#333333',
    secondary: '#666666',
  },
  divider: '#e0e0e0',
};

// Dark theme palette
const darkPalette = {
  mode: 'dark',
  primary: {
    main: '#5a9fd4',
    light: '#8bc4ea',
    dark: '#2E75B6',
  },
  secondary: {
    main: '#8fa4bd',
  },
  success: {
    main: '#66bb6a',
  },
  warning: {
    main: '#ffb74d',
  },
  error: {
    main: '#ef5350',
  },
  background: {
    default: '#121212',
    paper: '#1e1e1e',
  },
  text: {
    primary: '#e0e0e0',
    secondary: '#a0a0a0',
  },
  divider: '#333333',
};

const createAppTheme = (mode) => {
  const palette = mode === 'dark' ? darkPalette : lightPalette;

  return createTheme({
    palette,
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: {
        fontWeight: 600,
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 600,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: mode === 'dark'
              ? '0 2px 8px rgba(0,0,0,0.3)'
              : '0 2px 8px rgba(0,0,0,0.08)',
            border: mode === 'dark' ? '1px solid #333' : 'none',
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            transition: 'background-color 0.3s ease, border-color 0.3s ease, width 0.3s ease',
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          variant: 'outlined',
          size: 'small',
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            transition: 'background-color 0.3s ease, color 0.3s ease',
          },
        },
      },
    },
  });
};

export const ThemeContextProvider = ({ children }) => {
  // Initialize from localStorage or default to light
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('themeMode');
    return savedMode || 'light';
  });

  // Save to localStorage when mode changes
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const theme = useMemo(() => createAppTheme(mode), [mode]);

  const value = useMemo(
    () => ({
      mode,
      toggleTheme,
      isDark: mode === 'dark',
    }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children(theme)}
    </ThemeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeContextProvider');
  }
  return context;
};

export default ThemeContext;
