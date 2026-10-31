import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { setupTestServer, closeTestServer } from './setupTestServer';
import os from 'os';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    // 1. Limpiar cualquier conexión o modelos remanentes de Mongoose
    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    // 2. Crear el servidor en memoria
    mongoServer = await MongoMemoryServer.create();

    const mongoUri = mongoServer.getUri();

    // 3. Conectar a la base de datos en memoria
    await mongoose.connect(mongoUri, {
        runtimeAdapters: { os } // Proporciona la metadata de cliente requerida por el driver
    });

    // 4. Inicializar servidor de pruebas
    await setupTestServer();
}, 60000);

afterAll(async () => {
    await closeTestServer();

    if (mongoose.connection.readyState !== 0) {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
        await mongoose.disconnect();
    }

    if (mongoServer) {
        await mongoServer.stop({ doCleanup: true });
    }
}, 30000);

afterEach(async () => {
    if (mongoose.connection.readyState !== 0 && mongoose.connection.db) {
        const collections = await mongoose.connection.db.collections();
        for (const collection of collections) {
            await collection.deleteMany({});
        }
    }
});
