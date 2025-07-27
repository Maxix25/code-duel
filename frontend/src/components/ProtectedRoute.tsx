import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import getToken from '../api/auth/getToken';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        auth();
    }, []);

    const auth = async () => {
        try {
            const token = await getToken();
            if (!token) {
                setIsAuthorized(false);
                return;
            }
            setIsAuthorized(true);
        } catch (error) {
            console.error('Token is not valid', error);
            setIsAuthorized(false);
        }
    };

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }
    return isAuthorized ? children : <Navigate to='/login' />;
};

export default ProtectedRoute;
