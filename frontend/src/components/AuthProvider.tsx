import { useState, useEffect, ReactNode } from 'react';
import AuthContext from '../context/AuthContext';
import api from '../api/api';
interface AuthProviderProps {
    children: ReactNode;
}
const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        api.post('/auth/verify')
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

export default AuthProvider;