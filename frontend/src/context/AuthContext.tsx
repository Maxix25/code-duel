import { createContext, useState, useEffect, ReactNode } from 'react';
import api from '../api/api';

interface AuthContextType {
    isAuthenticated: boolean;
    logout: () => void;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
}
export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    logout: () => {},
    setIsAuthenticated: () => {}
});

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        api.post('http://localhost:3000/auth/verify')
            .then(() => {
                setIsAuthenticated(true);
            })
            .catch(() => {
                setIsAuthenticated(false);
            });
    }, []);

    const logout = () => {
        api.get('/auth/logout')
            .then(() => {
                setIsAuthenticated(false);
                window.location.href = '/login';
            })
            .catch((error) => {
                console.error('Logout error:', error);
            });
    };

    return (
        <AuthContext.Provider
            value={{ isAuthenticated, logout, setIsAuthenticated }}
        >
            {children}
        </AuthContext.Provider>
    );
};
