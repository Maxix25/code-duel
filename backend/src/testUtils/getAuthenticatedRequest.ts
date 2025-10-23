import request from 'supertest';
import { getTestServer } from '../jest/setupTestServer';

/**
 * Helper to create an authenticated user and return the cookie and token
 */
export async function getAuthenticatedRequest(
    username: string,
    password: string
): Promise<{ cookie: string; token: string }> {
    const response = await request(getTestServer())
        .post('/auth/login')
        .send({ username, password });

    const cookie = response.headers['set-cookie'][0];
    const token = cookie.split(';')[0].split('=')[1];

    return { cookie, token };
}
