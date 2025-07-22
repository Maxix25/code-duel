import { render, screen, fireEvent } from '@testing-library/react';
import RegisterPage from '../pages/RegisterPage';
import { BrowserRouter } from 'react-router-dom';

describe('RegisterPage', () => {
    beforeEach(() => {
        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );
    });
    it('should render the registration form', () => {
        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getAllByLabelText(/password/i)).toHaveLength(2);
    });

    it('should show error when passwords do not match', () => {
        const passwordInput = screen.getAllByLabelText(/password/i)[0];
        const confirmPasswordInput = screen.getAllByLabelText(/password/i)[1];
        const submitButton = screen.getByRole('button', { name: /sign up/i });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.change(confirmPasswordInput, {
            target: { value: 'differentPassword' },
        });
        fireEvent.click(submitButton);

        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
});
