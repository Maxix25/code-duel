import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import api from '../api/api';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        auth();
    }, []);

    const auth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setIsAuthorized(false);
            return;
        }
        try {
            const response = await api.post('/auth/verify', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.status === 200) {
                setIsAuthorized(true);
            } else {
                setIsAuthorized(false);
            }
        } catch (error) {
            console.error('Error verifying token:', error);
            setIsAuthorized(false);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }
    return isAuthorized ? children : <Navigate to='/login' />;
};

export default ProtectedRoute;
