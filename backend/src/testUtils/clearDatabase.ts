import mongoose from 'mongoose';

/**
 * Clears all collections in the test database
 */
export async function clearDatabase(): Promise<void> {
    const collections = mongoose.connection.collections;
    for (const key in collections) {
        await collections[key].deleteMany({});
    }
}
