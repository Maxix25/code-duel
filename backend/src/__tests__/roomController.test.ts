import request from 'supertest';
import { getTestServer } from '../jest/setupTestServer';
import { clearDatabase } from '../testUtils/clearDatabase';
import { getAuthenticatedRequest } from '../testUtils/getAuthenticatedRequest';
import createTestPlayer from '../testUtils/createTestPlayer';
import createTestQuestion from '../testUtils/createTestQuestion';
import { getRandomQuestion } from '../models/Question';

let cookie: string;

describe('Room Controller', () => {
    beforeAll(async () => {
        await clearDatabase();

        await createTestPlayer(
            'testuser1',
            'password1',
            'testuser1@example.com'
        );
        await createTestQuestion();

        const question = await getRandomQuestion();
        expect(question).not.toBeNull();

        const auth = await getAuthenticatedRequest('testuser1', 'password1');
        cookie = auth.cookie;
    });

    it('should create a new room', async () => {
        const response = await request(getTestServer())
            .post('/room/start')
            .send({ password: '' })
            .set('Cookie', cookie);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('roomId');
    });
});
