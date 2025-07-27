import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import RegisterPage from '../pages/RegisterPage';
import { BrowserRouter } from 'react-router-dom';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

const server = setupServer(
    http.post('/auth/register', () => {
        localStorage.setItem('token', 'mocked_token');
        return HttpResponse.json(
            {
                message: 'Registration successful',
                token: 'mocked_token'
            },
            { status: 201 }
        );
    })
);

describe('RegisterPage', () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());
    it('should render the registration form', () => {
        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getAllByLabelText(/password/i)).toHaveLength(2);
    });

    it('should show error when passwords do not match', () => {
        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );
        const passwordInput = screen.getAllByLabelText(/password/i)[0];
        const confirmPasswordInput = screen.getAllByLabelText(/password/i)[1];
        const submitButton = screen.getByRole('button', { name: /sign up/i });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, {
            target: { value: 'differentPassword' }
        });
        fireEvent.click(submitButton);

        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
    it('should submit the form with valid credentials', async () => {
        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );
        const usernameInput = screen.getByLabelText(/username/i);
        const emailInput = screen.getByLabelText(/email/i);
        const passwordInput = screen.getAllByLabelText(/password/i)[0];
        const confirmPasswordInput = screen.getAllByLabelText(/password/i)[1];
        const submitButton = screen.getByRole('button', { name: /sign up/i });

        fireEvent.change(usernameInput, { target: { value: 'testuser123' } });
        fireEvent.change(emailInput, {
            target: { value: 'testuser123@example.com' }
        });
        fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
        fireEvent.change(confirmPasswordInput, {
            target: { value: 'testpassword' }
        });
        fireEvent.click(submitButton);

        await waitFor(() => {
            const token = localStorage.getItem('token');
            expect(token).toBe('mocked_token');
            expect(window.location.pathname).toBe('/dashboard');
        });
    });
});
