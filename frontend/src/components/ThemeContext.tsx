import React, {
    useState,
    useMemo,
    ReactNode
} from 'react';
import {
    createTheme,
    ThemeProvider as MuiThemeProvider
} from '@mui/material/styles';
import { ThemeContext } from '../context/ThemeContext';

type PaletteMode = 'light' | 'dark';

interface CustomThemeProviderProps {
    children: ReactNode;
}

export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({
    children
}) => {
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
                            primary: { main: '#6366f1' }, // Modern indigo
                            secondary: { main: '#f59e0b' }, // Warm amber
                            background: {
                                default: '#f8fafc',
                                paper: '#ffffff'
                            }, // Softer background
                            text: {
                                primary: '#1e293b',
                                secondary: '#64748b'
                            }, // Better contrast
                            divider: '#e2e8f0',
                            success: { main: '#10b981' }, // Modern green
                            error: { main: '#ef4444' }, // Modern red
                            warning: { main: '#f59e0b' }, // Amber
                            info: { main: '#06b6d4' } // Cyan
                        }
                        : {
                            primary: { main: '#818cf8' }, // Lighter indigo for dark mode
                            secondary: { main: '#fbbf24' }, // Brighter amber for dark mode
                            background: {
                                default: '#0f172a',
                                paper: '#1e293b'
                            }, // Modern dark slate
                            text: {
                                primary: '#f1f5f9',
                                secondary: '#94a3b8'
                            }, // Better dark mode text
                            divider: '#334155',
                            success: { main: '#34d399' }, // Brighter green for dark mode
                            error: { main: '#f87171' }, // Softer red for dark mode
                            warning: { main: '#fbbf24' }, // Amber
                            info: { main: '#22d3ee' } // Bright cyan
                        })
                },
                components: {
                    MuiButton: {
                        styleOverrides: {
                            root: {
                                borderRadius: 8
                            }
                        }
                    },
                    MuiContainer: {
                        styleOverrides: {
                            root: {
                                marginLeft: 'auto',
                                marginRight: 'auto'
                            }
                        }
                    }
                }
            }),
        [mode]
    );

    return (
        <ThemeContext.Provider value={{ toggleTheme, mode }}>
            <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
        </ThemeContext.Provider>
    );
};


