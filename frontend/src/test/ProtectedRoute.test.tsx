import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';

const renderRoute = (
    isAuthenticated: boolean,
    isLoading: boolean,
    initialPath = '/private'
) =>
    render(
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                logout: vi.fn(),
                setIsAuthenticated: vi.fn()
            }}
        >
            <MemoryRouter initialEntries={[initialPath]}>
                <Routes>
                    <Route
                        path='/private'
                        element={
                            <ProtectedRoute>
                                <div>Protected content</div>
                            </ProtectedRoute>
                        }
                    />
                    <Route path='/login' element={<div>Login page</div>} />
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>
    );

describe('ProtectedRoute', () => {
    it('shows loading while the session is being verified', () => {
        renderRoute(false, true);

        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders protected content for an authenticated user', () => {
        renderRoute(true, false);

        expect(screen.getByText('Protected content')).toBeInTheDocument();
    });

    it('redirects anonymous users to login', () => {
        renderRoute(false, false);

        expect(screen.getByText('Login page')).toBeInTheDocument();
    });
});
