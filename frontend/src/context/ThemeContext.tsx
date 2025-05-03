import React, { createContext, useState, useMemo, useContext, ReactNode } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider, PaletteMode } from '@mui/material';
import { grey, blue } from '@mui/material/colors';

interface ThemeContextType {
    toggleTheme: () => void;
    mode: PaletteMode;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface CustomThemeProviderProps {
    children: ReactNode;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({ children }) => {
    const getInitialMode = (): PaletteMode => {
        const saved = localStorage.getItem('themeMode');
        return saved === 'dark' || saved === 'light' ? saved : 'light';
    };
    const [mode, setMode] = useState<PaletteMode>(getInitialMode);

    const toggleTheme = () => {
        setMode((prevMode) => {
            const nextMode = prevMode === 'light' ? 'dark' : 'light';
            localStorage.setItem('themeMode', nextMode);
            return nextMode;
        });
    };

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                    ...(mode === 'light'
                        ? {
                            primary: { main: blue[600] },
                            secondary: { main: grey[500] },
                            background: { default: grey[50], paper: '#ffffff' },
                            text: { primary: grey[900], secondary: grey[700] },
                            divider: grey[300],
                        }
                        : {
                            primary: { main: blue[300] },
                            secondary: { main: grey[600] },
                            background: { default: '#121212', paper: grey[900] },
                            text: { primary: '#ffffff', secondary: grey[400] },
                            divider: grey[700],
                        }),
                },
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8,
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
        throw new Error('useThemeContext must be used within a CustomThemeProvider');
    }
    return context;
};
