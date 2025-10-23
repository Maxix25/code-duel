import request from 'supertest';
import { getTestServer } from '../jest/setupTestServer';
import { clearDatabase } from '../testUtils/clearDatabase';

describe('Auth Controller', () => {
    beforeAll(async () => {
        await clearDatabase();
    });

    it('should register a new user', async () => {
        const response = await request(getTestServer())
            .post('/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password',
                username: 'testuser'
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
    });

    it('should log in an existing user', async () => {
        const response = await request(getTestServer())
            .post('/auth/login')
            .send({
                username: 'testuser',
                password: 'password'
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
});
