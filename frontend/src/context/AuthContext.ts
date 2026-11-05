import { createContext } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    isLoading: boolean;
    logout: () => void;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}
const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    isLoading: true,
    logout: () => {},
    setIsAuthenticated: () => {}
});

export default AuthContext;
