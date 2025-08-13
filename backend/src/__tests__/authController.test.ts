import request from 'supertest';
import { httpServer } from '../server';
import mongoose from 'mongoose';

describe('Auth Controller', () => {
    beforeAll(async () => {
        console.time('Connecting to test database');
        await mongoose.disconnect();
        await mongoose.connect(
            process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/test'
        );
        console.timeEnd('Connecting to test database');
    });
    afterAll(async () => {
        console.time('Disconnecting from test database');
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
        console.timeEnd('Disconnecting from test database');
    });

    it('should register a new user', async () => {
        console.time('Registering user');
        const response = await request(httpServer).post('/auth/register').send({
            email: 'test@example.com',
            password: 'password',
            username: 'testuser'
        });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('token');
        console.timeEnd('Registering user');
    });

    it('should log in an existing user', async () => {
        console.time('Logging in user');
        const response = await request(httpServer).post('/auth/login').send({
            username: 'testuser',
            password: 'password'
        });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        console.timeEnd('Logging in user');
    });
});
