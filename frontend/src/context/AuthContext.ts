import { createContext } from 'react';

interface AuthContextType {
    isAuthenticated: boolean;
    logout: () => void;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}
const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    logout: () => { },
    setIsAuthenticated: () => { }
});

export default AuthContext;




