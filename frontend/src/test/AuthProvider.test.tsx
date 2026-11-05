import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse, delay } from 'msw';
import { setupServer } from 'msw/node';
import AuthProvider from '../components/AuthProvider';
import useAuth from '../hooks/useAuth';

const server = setupServer();

const AuthStatus = () => {
    const { isAuthenticated, isLoading } = useAuth();

    return (
        <div>
            <span>{isLoading ? 'loading' : 'ready'}</span>
            <span>{isAuthenticated ? 'authenticated' : 'anonymous'}</span>
        </div>
    );
};

describe('AuthProvider', () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it('shows loading and then the authenticated state after verification', async () => {
        let verificationRequests = 0;
        server.use(
            http.post('/auth/verify', async () => {
                verificationRequests += 1;
                await delay(20);
                return HttpResponse.json({ message: 'Token is valid' });
            })
        );

        render(
            <AuthProvider>
                <AuthStatus />
            </AuthProvider>
        );

        expect(screen.getByText('loading')).toBeInTheDocument();
        expect(screen.getByText('anonymous')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('ready')).toBeInTheDocument();
            expect(screen.getByText('authenticated')).toBeInTheDocument();
        });
        expect(verificationRequests).toBe(1);
    });

    it('sets the anonymous state when verification fails', async () => {
        server.use(
            http.post('/auth/verify', () =>
                HttpResponse.json({ message: 'Unauthorized' }, { status: 500 })
            )
        );

        render(
            <AuthProvider>
                <AuthStatus />
            </AuthProvider>
        );

        await waitFor(() => {
            expect(screen.getByText('ready')).toBeInTheDocument();
        });
        expect(screen.getByText('anonymous')).toBeInTheDocument();
    });
});
