import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { setupTestServer, closeTestServer } from './setupTestServer';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create({
        binary: {
            version: process.env.MONGO_MEMORY_VERSION || '7.0.14' // ONLY IF YOUR CPU DOESN'T SUPPORT AVX
        }
    });
    const mongoUri = mongoServer.getUri();

    // Connect to in-memory database
    await mongoose.connect(mongoUri);

    // Setup test server
    await setupTestServer();
}, 60000);

afterAll(async () => {
    // Close test server
    await closeTestServer();

    // Disconnect from database
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    // Stop in-memory MongoDB server
    if (mongoServer) {
        await mongoServer.stop();
    }
}, 30000);
