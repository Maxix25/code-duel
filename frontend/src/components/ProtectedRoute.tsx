import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import useAuth from '../hooks/useAuth';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>;
    }
    return isAuthenticated ? children : <Navigate to='/login' />;
};

export default ProtectedRoute;
