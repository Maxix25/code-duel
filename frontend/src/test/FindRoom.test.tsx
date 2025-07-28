import { render, screen } from '@testing-library/react';
import FindRoomPage from '../pages/FindRoomPage';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { BrowserRouter } from 'react-router-dom';

const server = setupServer(
    http.get('/room/all', () => {
        return HttpResponse.json(
            [
                {
                    id: '1',
                    name: 'Room 1'
                },
                {
                    id: '2',
                    name: 'Room 2'
                }
            ],
            { status: 200 }
        );
    })
);

describe('FindRoomPage', () => {
    beforeAll(() => server.listen());
    afterEach(() => server.resetHandlers());
    afterAll(() => server.close());

    it('should render the FindRoomPage', () => {
        render(
            <BrowserRouter>
                <FindRoomPage />
            </BrowserRouter>
        );
        expect(screen.getByText(/available rooms/i)).toBeInTheDocument();
    });

    it('should fetch and display rooms', async () => {
        render(
            <BrowserRouter>
                <FindRoomPage />
            </BrowserRouter>
        );
        expect(await screen.findByText('Room 1')).toBeInTheDocument();
        expect(screen.getByText('Room 2')).toBeInTheDocument();
    });

    it('should show no rooms available message when no rooms are fetched', async () => {
        server.use(
            http.get('/room/all', () => {
                return HttpResponse.json([], { status: 200 });
            })
        );

        render(
            <BrowserRouter>
                <FindRoomPage />
            </BrowserRouter>
        );
        expect(
            await screen.findByText(/no rooms available at the moment/i)
        ).toBeInTheDocument();
    });
    it('should find join buttons', async () => {
        render(
            <BrowserRouter>
                <FindRoomPage />
            </BrowserRouter>
        );
        const joinButtons = await screen.findAllByRole('button', {
            name: /join/i
        });
        expect(joinButtons.length).toBe(2);
    });
});
