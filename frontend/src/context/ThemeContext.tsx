import React, {
    createContext,
    useState,
    useMemo,
    useContext,
    ReactNode,
} from 'react';
import {
    createTheme,
    ThemeProvider as MuiThemeProvider,
    PaletteMode,
} from '@mui/material';
import { grey, blue } from '@mui/material/colors'; // Import blue

interface ThemeContextType {
    toggleTheme: () => void;
    mode: PaletteMode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface CustomThemeProviderProps {
    children: ReactNode;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({
    children,
}) => {
    const [mode, setMode] = useState<PaletteMode>('light');

    const toggleTheme = () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === 'light'
                        ? {
                              // Modern light mode palette
                              primary: {
                                  main: blue[600], // Use a nice blue shade
                              },
                              secondary: {
                                  main: grey[500], // Keep secondary grey for now
                              },
                              background: {
                                  default: grey[50], // Slightly off-white background
                                  paper: '#ffffff', // White paper background
                              },
                              text: {
                                  primary: grey[900],
                                  secondary: grey[700],
                              },
                              divider: grey[300],
                          }
                        : {
                              // Modern dark mode palette
                              primary: {
                                  main: blue[300], // Lighter blue for dark mode contrast
                              },
                              secondary: {
                                  main: grey[600],
                              },
                              background: {
                                  default: '#121212', // Standard dark background
                                  paper: grey[900], // Darker paper background
                              },
                              text: {
                                  primary: '#ffffff',
                                  secondary: grey[400],
                              },
                              divider: grey[700],
                          }),
                },
                // You can further customize typography, component styles etc. here
                // Example: Add slightly rounded corners to buttons
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8, // Example: Rounded corners
                            },
                        },
                    },
                    MuiContainer: {
                        styleOverrides: {
                            root: {
                                marginLeft: 'auto',
                                marginRight: 'auto',
                            },
                        },
                    },
                },
            }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={{ toggleTheme, mode }}>
            <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error(
            'useThemeContext must be used within a CustomThemeProvider'
        );
    }
    return context;
};
