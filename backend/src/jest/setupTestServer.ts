import http from 'http';
import app from '../app';

let httpServer: http.Server | null = null;

export async function setupTestServer(): Promise<http.Server> {
    if (!httpServer) {
        // Create HTTP server with the Express app
        // Database connection is already handled in globalSetup
        httpServer = http.createServer(app);
    }
    return httpServer;
}

export async function closeTestServer(): Promise<void> {
    if (httpServer && httpServer.listening) {
        await new Promise<void>((resolve, reject) => {
            httpServer!.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
        httpServer = null;
    }
}

export function getTestServer(): http.Server {
    if (!httpServer) {
        throw new Error(
            'Test server not initialized. Call setupTestServer() first.'
        );
    }
    return httpServer;
}
