import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import EnterPasswordPage from '../pages/EnterPasswordPage';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const ROOM_ID = '123';
const server = setupServer(
    http.post(`/room/${ROOM_ID}/validate-password`, async ({ request }) => {
        const { password } = (await request.json()) as { password: string };
        if (password === 'correctpass') {
            return HttpResponse.json({ success: true }, { status: 200 });
        }
        return HttpResponse.json(
            { error: 'Invalid password' },
            { status: 400 }
        );
    })
);

describe('EnterPasswordPage', () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());
    it('shows error snackbar on invalid password', async () => {
        render(
            <MemoryRouter
                initialEntries={[`/enter-password?roomId=${ROOM_ID}`]}
            >
                <Routes>
                    <Route
                        path='/enter-password'
                        element={<EnterPasswordPage />}
                    />
                </Routes>
            </MemoryRouter>
        );
        const input = screen.getByLabelText(/password/i);
        const button = screen.getByRole('button', { name: /join room/i });
        fireEvent.change(input, { target: { value: 'wrongpass' } });
        fireEvent.click(button);
        await waitFor(() => {
            expect(screen.getByText(/invalid password/i)).toBeInTheDocument();
        });
    });

    it('navigates to room on valid password', async () => {
        render(
            <MemoryRouter
                initialEntries={[`/enter-password?roomId=${ROOM_ID}`]}
            >
                <Routes>
                    <Route
                        path='/enter-password'
                        element={<EnterPasswordPage />}
                    />
                    <Route path='/room' element={<div>Room Page Loaded</div>} />
                </Routes>
            </MemoryRouter>
        );
        const input = screen.getByLabelText(/password/i);
        const button = screen.getByRole('button', { name: /join room/i });
        fireEvent.change(input, { target: { value: 'correctpass' } });
        fireEvent.click(button);
        await waitFor(() => {
            expect(screen.getByText(/room page loaded/i)).toBeInTheDocument();
        });
    });
});
