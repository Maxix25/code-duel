import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import getToken from '../api/auth/getToken';

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    useEffect(() => {
        let isActive = true;

        getToken()
            .then((token) => {
                if (isActive) {
                    setIsAuthorized(Boolean(token));
                }
            })
            .catch((error) => {
                console.error('Token is not valid', error);
                if (isActive) {
                    setIsAuthorized(false);
                }
            });

        return () => {
            isActive = false;
        };
    }, []);

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }
    return isAuthorized ? children : <Navigate to='/login' />;
};

export default ProtectedRoute;
