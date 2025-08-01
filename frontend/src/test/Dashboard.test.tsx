import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, BrowserRouter } from 'react-router-dom';
import DashboardPage from '../pages/DashboardPage';

// Mock navigation
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate
    };
});

// Mock API functions
vi.mock('../api/room/createRoom', () => ({
    default: vi.fn()
}));

vi.mock('../api/room/checkIfUserIsInRoom', () => ({
    default: vi.fn()
}));

import createRoom from '../api/room/createRoom';
import checkIfUserIsInRoom from '../api/room/checkIfUserIsInRoom';

const mockedCreateRoom = vi.mocked(createRoom);
const mockedCheckIfUserIsInRoom = vi.mocked(checkIfUserIsInRoom);

describe('DashboardPage', () => {
    beforeEach(() => {
        // Reset all mocks before each test
        vi.clearAllMocks();
        mockNavigate.mockClear();

        // Default mock implementations
        mockedCheckIfUserIsInRoom.mockResolvedValue({
            inRoom: false,
            roomId: undefined
        });

        mockedCreateRoom.mockResolvedValue({
            status: 200,
            roomId: 'test-room-123'
        });
    });

    it('should render the dashboard title', () => {
        render(
            <MemoryRouter>
                <DashboardPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('should render all three main cards', () => {
        render(
            <MemoryRouter>
                <DashboardPage />
            </MemoryRouter>
        );

        expect(screen.getByText('Create New Room')).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: 'Find Room' })
        ).toBeInTheDocument();
        expect(screen.getByText('Join Existing Room')).toBeInTheDocument();
    });

    it('should render descriptive text for each card', () => {
        render(
            <MemoryRouter>
                <DashboardPage />
            </MemoryRouter>
        );

        expect(
            screen.getByText('Start a new 1v1 code duel.')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Browse available rooms to join.')
        ).toBeInTheDocument();
    });

    describe('Create New Room functionality', () => {
        it('should allow user to enter a room password', () => {
            render(
                <MemoryRouter>
                    <DashboardPage />
                </MemoryRouter>
            );

            const passwordInput = screen.getByLabelText(/room password/i);
            fireEvent.change(passwordInput, { target: { value: 'test123' } });

            expect(passwordInput).toHaveValue('test123');
        });

        it('should create a room and navigate when Create Room button is clicked', async () => {
            render(
                <BrowserRouter>
                    <DashboardPage />
                </BrowserRouter>
            );

            const passwordInput = screen.getByLabelText(/room password/i);
            const createButton = screen.getByRole('button', {
                name: /create room/i
            });

            fireEvent.change(passwordInput, {
                target: { value: 'mypassword' }
            });
            fireEvent.click(createButton);

            await waitFor(() => {
                expect(mockedCreateRoom).toHaveBeenCalledWith('mypassword');
                expect(mockNavigate).toHaveBeenCalledWith(
                    '/room?roomId=test-room-123'
                );
            });
        });

        it('should show alert when create room fails with status 400', async () => {
            mockedCreateRoom.mockResolvedValue({
                status: 400,
                roomId: 'existing-room-456'
            });

            // Mock alert
            global.alert = vi.fn();

            render(
                <BrowserRouter>
                    <DashboardPage />
                </BrowserRouter>
            );

            const createButton = screen.getByRole('button', {
                name: /create room/i
            });
            fireEvent.click(createButton);

            await waitFor(() => {
                expect(global.alert).toHaveBeenCalledWith(
                    'Error creating room: Already in room with ID existing-room-456'
                );
            });
        });

        it('should show alert for unexpected errors', async () => {
            mockedCreateRoom.mockResolvedValue({
                status: 500,
                roomId: undefined
            });

            global.alert = vi.fn();

            render(
                <BrowserRouter>
                    <DashboardPage />
                </BrowserRouter>
            );

            const createButton = screen.getByRole('button', {
                name: /create room/i
            });
            fireEvent.click(createButton);

            await waitFor(() => {
                expect(global.alert).toHaveBeenCalledWith(
                    'Unexpected error occurred while creating room'
                );
            });
        });
    });

    describe('Find Room functionality', () => {
        it('should navigate to find-room page when Find Room button is clicked', () => {
            render(
                <BrowserRouter>
                    <DashboardPage />
                </BrowserRouter>
            );

            const findRoomButton = screen.getByRole('button', {
                name: /find room/i
            });
            fireEvent.click(findRoomButton);

            expect(mockNavigate).toHaveBeenCalledWith('/find-room');
        });
    });

    describe('Join Existing Room functionality', () => {
        it('should allow user to enter a room ID and join', async () => {
            render(
                <BrowserRouter>
                    <DashboardPage />
                </BrowserRouter>
            );

            const roomIdInput = screen.getByLabelText(/enter room id/i);
            const joinButton = screen.getByRole('button', {
                name: /join room/i
            });

            fireEvent.change(roomIdInput, { target: { value: 'room-789' } });
            fireEvent.click(joinButton);

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith(
                    '/room?roomId=room-789'
                );
            });
        });

        it('should clear room ID input after joining', async () => {
            render(
                <BrowserRouter>
                    <DashboardPage />
                </BrowserRouter>
            );

            const roomIdInput = screen.getByLabelText(
                /enter room id/i
            ) as HTMLInputElement;
            const joinButton = screen.getByRole('button', {
                name: /join room/i
            });

            fireEvent.change(roomIdInput, { target: { value: 'room-789' } });
            fireEvent.click(joinButton);

            await waitFor(() => {
                expect(roomIdInput.value).toBe('');
            });
        });
    });

    describe('User already in room state', () => {
        beforeEach(() => {
            mockedCheckIfUserIsInRoom.mockResolvedValue({
                inRoom: true,
                roomId: 'current-room-123'
            });
        });

        it('should show current room information when user is already in a room', async () => {
            render(
                <MemoryRouter>
                    <DashboardPage />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(
                    screen.getByText('Currently in room:')
                ).toBeInTheDocument();
                expect(
                    screen.getByText('current-room-123')
                ).toBeInTheDocument();
                expect(
                    screen.getByRole('button', { name: /go to room/i })
                ).toBeInTheDocument();
            });
        });

        it('should disable Create Room button when user is already in a room', async () => {
            render(
                <MemoryRouter>
                    <DashboardPage />
                </MemoryRouter>
            );

            await waitFor(() => {
                const createButton = screen.getByRole('button', {
                    name: /create room/i
                });
                expect(createButton).toBeDisabled();
            });
        });

        it('should navigate to current room when Go to Room button is clicked', async () => {
            render(
                <BrowserRouter>
                    <DashboardPage />
                </BrowserRouter>
            );

            await waitFor(() => {
                const goToRoomButton = screen.getByRole('button', {
                    name: /go to room/i
                });
                fireEvent.click(goToRoomButton);

                expect(mockNavigate).toHaveBeenCalledWith(
                    '/room?roomId=current-room-123'
                );
            });
        });

        it('should not show room ID input form when user is already in a room', async () => {
            render(
                <MemoryRouter>
                    <DashboardPage />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(
                    screen.queryByLabelText(/enter room id/i)
                ).not.toBeInTheDocument();
            });
        });
    });

    describe('API error handling', () => {
        it('should handle checkIfUserIsInRoom API error gracefully', async () => {
            mockedCheckIfUserIsInRoom.mockRejectedValue(new Error('API Error'));

            // Mock console.error to prevent error logs in test output
            const consoleSpy = vi
                .spyOn(console, 'error')
                .mockImplementation(() => {});

            render(
                <MemoryRouter>
                    <DashboardPage />
                </MemoryRouter>
            );

            await waitFor(() => {
                expect(consoleSpy).toHaveBeenCalledWith(
                    'Failed to check if user is in a room:',
                    expect.any(Error)
                );
            });

            consoleSpy.mockRestore();
        });
    });

    describe('Form submission', () => {
        it('should handle form submission for joining room', async () => {
            render(
                <BrowserRouter>
                    <DashboardPage />
                </BrowserRouter>
            );

            const roomIdInput = screen.getByLabelText(/enter room id/i);
            const form = roomIdInput.closest('form');

            fireEvent.change(roomIdInput, {
                target: { value: 'form-room-123' }
            });

            if (form) {
                fireEvent.submit(form);
            }

            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith(
                    '/room?roomId=form-room-123'
                );
            });
        });
    });
});
