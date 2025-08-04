import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import ProfileUpdate from '../pages/ProfileUpdate';
import { MemoryRouter } from 'react-router-dom';

const mockUserProfile = {
    id: '123',
    username: 'testuser',
    email: 'test@example.com'
};

const server = setupServer(
    // Mock getProfile endpoint
    http.get('/auth/profile', () => {
        return HttpResponse.json(
            {
                message: 'Profile retrieved successfully',
                player: mockUserProfile
            },
            { status: 200 }
        );
    }),
    // Mock updateProfile endpoint
    http.put('/auth/update', () => {
        return HttpResponse.json(
            {
                message: 'Profile updated successfully',
                player: mockUserProfile
            },
            { status: 200 }
        );
    })
);

describe('ProfileUpdate', () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it('should show loading spinner initially', () => {
        render(
            <MemoryRouter>
                <ProfileUpdate />
            </MemoryRouter>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should render the profile update form after loading', async () => {
        render(
            <MemoryRouter>
                <ProfileUpdate />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /update profile/i })).toBeInTheDocument();
        });

        expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/current password \(optional\)/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/new password \(optional\)/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirm new password/i)).toBeInTheDocument();
    });

    it('should populate form with user data', async () => {
        render(
            <MemoryRouter>
                <ProfileUpdate />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
        });

        expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
    });

    it('should show error when trying to change password without current password', async () => {
        render(
            <MemoryRouter>
                <ProfileUpdate />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /update profile/i })).toBeInTheDocument();
        });

        const newPasswordInput = screen.getByLabelText(/new password \(optional\)/i);
        const submitButton = screen.getByRole('button', { name: /update profile/i });

        fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/current password is required to change password/i)).toBeInTheDocument();
        });
    });

    it('should show error when trying to enter current password without new password', async () => {
        render(
            <MemoryRouter>
                <ProfileUpdate />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /update profile/i })).toBeInTheDocument();
        });

        const currentPasswordInput = screen.getByLabelText(/current password/i);
        const submitButton = screen.getByRole('button', { name: /update profile/i });

        fireEvent.change(currentPasswordInput, { target: { value: 'oldpassword' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/new password is required/i)).toBeInTheDocument();
        });
    });

    it('should show error when new passwords do not match', async () => {
        render(
            <MemoryRouter>
                <ProfileUpdate />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /update profile/i })).toBeInTheDocument();
        });

        const currentPasswordInput = screen.getByLabelText(/current password \(optional\)/i);
        const newPasswordInput = screen.getByLabelText(/new password \(optional\)/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
        const submitButton = screen.getByRole('button', { name: /update profile/i });

        fireEvent.change(currentPasswordInput, { target: { value: 'oldpassword' } });
        fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'differentpassword' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/new passwords do not match/i)).toBeInTheDocument();
        });
    });

    it('should successfully update profile with username and email only', async () => {
        render(
            <MemoryRouter>
                <ProfileUpdate />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /update profile/i })).toBeInTheDocument();
        });

        const usernameInput = screen.getByLabelText(/username/i);
        const emailInput = screen.getByLabelText(/email address/i);
        const submitButton = screen.getByRole('button', { name: /update profile/i });

        fireEvent.change(usernameInput, { target: { value: 'newusername' } });
        fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
        });
    });

    it('should successfully update profile with password change', async () => {
        render(
            <MemoryRouter>
                <ProfileUpdate />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /update profile/i })).toBeInTheDocument();
        });

        const usernameInput = screen.getByLabelText(/username/i);
        const emailInput = screen.getByLabelText(/email address/i);
        const currentPasswordInput = screen.getByLabelText(/current password/i);
        const newPasswordInput = screen.getByLabelText(/new password \(optional\)/i);
        const confirmPasswordInput = screen.getByLabelText(/confirm new password/i);
        const submitButton = screen.getByRole('button', { name: /update profile/i });

        fireEvent.change(usernameInput, { target: { value: 'newusername' } });
        fireEvent.change(emailInput, { target: { value: 'newemail@example.com' } });
        fireEvent.change(currentPasswordInput, { target: { value: 'oldpassword' } });
        fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
        fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
        });

        // Check that password fields are cleared after successful update
        expect(currentPasswordInput).toHaveValue('');
        expect(newPasswordInput).toHaveValue('');
        expect(confirmPasswordInput).toHaveValue('');
    });

    it('should handle profile fetch error', async () => {
        server.use(
            http.get('/auth/profile', () => {
                return HttpResponse.json(
                    { message: 'Unauthorized' },
                    { status: 401 }
                );
            })
        );

        render(
            <MemoryRouter>
                <ProfileUpdate />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/failed to load profile/i)).toBeInTheDocument();
        });
    });

    it('should handle update profile error', async () => {
        server.use(
            http.put('/auth/update', () => {
                return HttpResponse.json(
                    { message: 'Invalid credentials' },
                    { status: 401 }
                );
            })
        );

        render(
            <MemoryRouter>
                <ProfileUpdate />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /update profile/i })).toBeInTheDocument();
        });

        const usernameInput = screen.getByLabelText(/username/i);
        const submitButton = screen.getByRole('button', { name: /update profile/i });

        fireEvent.change(usernameInput, { target: { value: 'newusername' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
        });
    });

    it('should handle update profile error without specific message', async () => {
        server.use(
            http.put('/auth/update', () => {
                return HttpResponse.json(
                    {},
                    { status: 500 }
                );
            })
        );

        render(
            <MemoryRouter>
                <ProfileUpdate />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /update profile/i })).toBeInTheDocument();
        });

        const usernameInput = screen.getByLabelText(/username/i);
        const submitButton = screen.getByRole('button', { name: /update profile/i });

        fireEvent.change(usernameInput, { target: { value: 'newusername' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/failed to update profile/i)).toBeInTheDocument();
        });
    });

    it('should show loading spinner when submitting', async () => {
        // Delay the response to test loading state
        server.use(
            http.put('/auth/update', async () => {
                await new Promise(resolve => setTimeout(resolve, 100));
                return HttpResponse.json(
                    {
                        message: 'Profile updated successfully',
                        player: mockUserProfile
                    },
                    { status: 200 }
                );
            })
        );

        render(
            <MemoryRouter>
                <ProfileUpdate />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /update profile/i })).toBeInTheDocument();
        });

        const usernameInput = screen.getByLabelText(/username/i);
        const submitButton = screen.getByRole('button', { name: /update profile/i });

        fireEvent.change(usernameInput, { target: { value: 'newusername' } });
        fireEvent.click(submitButton);

        // Should show loading spinner
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /update profile/i })).not.toBeInTheDocument();
    });

    it('should display helper text for password fields', async () => {
        render(
            <MemoryRouter>
                <ProfileUpdate />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /update profile/i })).toBeInTheDocument();
        });

        expect(screen.getByText(/only required if you want to change your password/i)).toBeInTheDocument();
        expect(screen.getByText(/leave empty to keep current password/i)).toBeInTheDocument();
    });

    it('should close snackbar when clicking close button', async () => {
        render(
            <MemoryRouter>
                <ProfileUpdate />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', { name: /update profile/i })).toBeInTheDocument();
        });

        const newPasswordInput = screen.getByLabelText(/new password \(optional\)/i);
        const submitButton = screen.getByRole('button', { name: /update profile/i });

        fireEvent.change(newPasswordInput, { target: { value: 'newpassword123' } });
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(screen.getByText(/current password is required to change password/i)).toBeInTheDocument();
        });

        const closeButton = screen.getByLabelText(/close/i);
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByText(/current password is required to change password/i)).not.toBeInTheDocument();
        });
    });
});
