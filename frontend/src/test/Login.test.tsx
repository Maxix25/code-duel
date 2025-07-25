import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import LoginPage from '../pages/LoginPage';
import { BrowserRouter } from 'react-router-dom';

const server = setupServer(
    http.post('/auth/login', () => {
        localStorage.setItem('token', 'mocked_token');
        return HttpResponse.json(
            {
                message: 'Login successful',
                token: 'mocked_token'
            },
            { status: 200 }
        );
    })
);

describe('LoginPage', () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());
    it('should render the login form', () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    });
    it('should submit the form with valid credentials', async () => {
        render(
            <BrowserRouter>
                <LoginPage />
            </BrowserRouter>
        );
        const usernameInput = screen.getByLabelText(/username/i);
        const passwordInput = screen.getByLabelText(/password/i);
        const submitButton = screen.getByRole('button', { name: /sign in/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser123' } });
        fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
        fireEvent.click(submitButton);
        await waitFor(() => {
            const token = localStorage.getItem('token');
            expect(token).toBe('mocked_token');
            expect(window.location.pathname).toBe('/dashboard');
        });
    });
});
