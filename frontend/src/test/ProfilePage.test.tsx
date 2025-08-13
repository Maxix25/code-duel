import { render, screen, waitFor } from '@testing-library/react';
import ProfilePage from '../pages/ProfilePage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

// Mock URL.createObjectURL and URL.revokeObjectURL since they're used for avatar display
global.URL.createObjectURL = vi.fn(() => 'mocked-object-url');
global.URL.revokeObjectURL = vi.fn();

const server = setupServer(
    http.get('/auth/profile/:playerId', () => {
        console.log('Mocked profile request');
        return HttpResponse.json({
            player: {
                id: '123',
                username: 'testuser',
                wins: 10,
                avatar: 'uploads/avatars/default.png',
                losses: 5,
                draws: 2
            }
        });
    }),
    http.get('/auth/avatar/:playerId', () => {
        // Create a mock image blob
        const mockImageData = new Uint8Array([
            0x89,
            0x50,
            0x4e,
            0x47,
            0x0d,
            0x0a,
            0x1a,
            0x0a, // PNG header
            0x00,
            0x00,
            0x00,
            0x0d,
            0x49,
            0x48,
            0x44,
            0x52, // IHDR chunk
            0x00,
            0x00,
            0x00,
            0x01,
            0x00,
            0x00,
            0x00,
            0x01, // 1x1 pixel
            0x08,
            0x02,
            0x00,
            0x00,
            0x00,
            0x90,
            0x77,
            0x53,
            0xde,
            0x00,
            0x00,
            0x00,
            0x0c,
            0x49,
            0x44,
            0x41,
            0x54,
            0x78,
            0x9c,
            0x63,
            0xf8,
            0x0f,
            0x00,
            0x00,
            0x01,
            0x00,
            0x01,
            0x5c,
            0xc2,
            0x8e,
            0x5e,
            0x00,
            0x00,
            0x00,
            0x00,
            0x49,
            0x45,
            0x4e,
            0x44,
            0xae,
            0x42,
            0x60,
            0x82
        ]);

        console.log('Mocked avatar request');
        return new Response(mockImageData.buffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/png',
                'Content-Length': mockImageData.length.toString()
            }
        });
    })
);

describe('ProfilePage', () => {
    beforeAll(() => server.listen());
    afterEach(() => {
        server.resetHandlers();
        vi.clearAllMocks();
    });
    afterAll(() => server.close());

    it('renders profile information', async () => {
        render(
            <MemoryRouter initialEntries={['/profile/123']}>
                <Routes>
                    <Route
                        path='/profile/:playerId'
                        element={<ProfilePage />}
                    />
                </Routes>
            </MemoryRouter>
        );

        // Wait for the profile data to load
        await waitFor(() => {
            expect(screen.getByText(/username/i)).toBeInTheDocument();
            expect(screen.getAllByText(/testuser/i)).toHaveLength(2);
        });

        // Check if the profile information is rendered
        expect(screen.getByText('10')).toBeInTheDocument(); // Wins
        expect(screen.getByText('5')).toBeInTheDocument(); // Losses
        expect(screen.getByText('2')).toBeInTheDocument(); // Draws

        // Check if game statistics section is rendered
        expect(screen.getByText('Game Statistics')).toBeInTheDocument();
        expect(screen.getByText('Wins')).toBeInTheDocument();
        expect(screen.getByText('Losses')).toBeInTheDocument();
        expect(screen.getByText('Ties')).toBeInTheDocument();

        // Check if URL.createObjectURL was called for the avatar
        expect(global.URL.createObjectURL).toHaveBeenCalled();
    });
});
