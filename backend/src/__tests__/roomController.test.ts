import request from 'supertest';
import { httpServer } from '../server';
import mongoose from 'mongoose';
import Question from '../models/Question';
import createTestQuestion from '../testUtils/createTestQuestion';
import getUserIdByToken from '../utils/getUserIdByToken';
import createTestRoom from '../testUtils/createTestRoom';
import createTestPlayer from '../testUtils/createTestPlayer';

let userId: mongoose.Schema.Types.ObjectId | null;
let roomId: mongoose.Schema.Types.ObjectId | null;
let token: string;

describe('Room Controller', () => {
    beforeAll(async () => {
        console.time('Connecting to test database');
        await mongoose.disconnect();
        await mongoose.connect(
            process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/test'
        );
        await createTestPlayer(
            'testuser1',
            'password1',
            'testuser1@example.com'
        );
        await createTestPlayer(
            'testuser2',
            'password2',
            'testuser2@example.com'
        );
        const response1 = await request(httpServer).post('/auth/login').send({
            username: 'testuser1',
            password: 'password1',
        });
        token = response1.body.token;
        expect(token).toBeDefined();
        userId = getUserIdByToken(token);
        expect(userId).toBeDefined();

        const question = await createTestQuestion();
        const room = await createTestRoom(
            userId!.toString(),
            question.id.toString()
        );
        roomId = room.id;
        expect(roomId).toBeDefined();
        room.players = [];
        await room.save();

        console.timeEnd('Connecting to test database');
    });

    afterAll(async () => {
        console.time('Disconnecting from test database');
        await mongoose.connection.dropDatabase();
        await mongoose.disconnect();
        console.timeEnd('Disconnecting from test database');
    });

    it('should create a new room', async () => {
        const response = await request(httpServer)
            .post('/room/start')
            .send({ user_token: token })
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('roomId');
    });
});
