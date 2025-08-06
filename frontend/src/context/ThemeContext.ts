import { createContext, useContext } from "react";
type PaletteMode = 'light' | 'dark';
interface ThemeContextType {
    toggleTheme: () => void;
    mode: PaletteMode;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error(
            'useThemeContext must be used within a CustomThemeProvider'
        );
    }
    return context;
};
