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

    it('should reject a registration without required fields', async () => {
        const response = await request(getTestServer())
            .post('/auth/register')
            .send({
                username: 'testuser'
            });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe(
            'Username, password and email are required'
        );
    });

    it('should reject a duplicate username or email', async () => {
        await request(getTestServer()).post('/auth/register').send({
            email: 'test@example.com',
            password: 'password',
            username: 'testuser'
        });

        const duplicateUsername = await request(getTestServer())
            .post('/auth/register')
            .send({
                email: 'other@example.com',
                password: 'password',
                username: 'testuser'
            });

        const duplicateEmail = await request(getTestServer())
            .post('/auth/register')
            .send({
                email: 'test@example.com',
                password: 'password',
                username: 'otheruser'
            });

        expect(duplicateUsername.status).toBe(409);
        expect(duplicateEmail.status).toBe(409);
    });

    it('should log in an existing user', async () => {
        // First, register the user
        await request(getTestServer()).post('/auth/register').send({
            email: 'test@example.com',
            password: 'password',
            username: 'testuser'
        });

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
