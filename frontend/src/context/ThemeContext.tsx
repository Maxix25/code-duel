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
import { grey } from '@mui/material/colors'; // Keep grey

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
                              // Neutral palette for light mode
                              primary: {
                                  main: grey[800], // Darker grey for primary elements
                              },
                              secondary: {
                                  main: grey[500], // Medium grey for secondary elements
                              },
                              background: {
                                  default: grey[100], // Very light grey background
                                  paper: '#ffffff', // White paper background
                              },
                              text: {
                                  primary: grey[900], // Almost black text
                                  secondary: grey[700], // Dark grey secondary text
                              },
                              divider: grey[300], // Light grey divider
                          }
                        : {
                              // Neutral palette for dark mode
                              primary: {
                                  main: grey[400], // Lighter grey for primary elements in dark mode
                              },
                              secondary: {
                                  main: grey[600], // Slightly darker grey for secondary
                              },
                              background: {
                                  default: grey[900], // Very dark grey background
                                  paper: grey[800], // Dark grey paper background
                              },
                              text: {
                                  primary: '#ffffff', // White text
                                  secondary: grey[400], // Light grey secondary text
                              },
                              divider: grey[700], // Dark grey divider
                          }),
                },
                // You can customize other theme aspects here (typography, components, etc.)
                components: {
                    // Add component overrides for centering if applicable globally
                    MuiContainer: {
                        styleOverrides: {
                            root: {
                                // Apply to the root of all Container components
                                marginLeft: 'auto',
                                marginRight: 'auto',
                                // Optionally add padding or max-width
                                // paddingLeft: '16px',
                                // paddingRight: '16px',
                                // maxWidth: 'lg' // Example max-width
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
