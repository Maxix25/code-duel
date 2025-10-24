import Room from '../models/Room';
import compiler from './compiler';

export const LANGUAGES = {
    python: { id: 71, name: 'Python' },
    javascript: { id: 63, name: 'JavaScript' },
    cpp: { id: 54, name: 'C++' }
};

interface Judge0Submission {
    language_id: number;
    source_code: string;
    stdin?: string;
    expected_output?: string;
}

interface Judge0ResponseNoWait {
    token: string;
}

const runCode = async (
    code: string,
    languageName: keyof typeof LANGUAGES,
    roomId: string,
    stdin?: string,
    expectedOutput?: string
): Promise<string> => {
    const language = LANGUAGES[languageName];
    if (!language) {
        throw new Error(`Unsupported language: ${languageName}`);
    }
    const room = await Room.findById(roomId);
    if (!room) {
        throw new Error(`Room not found: ${roomId}`);
    }
    const submission: Judge0Submission = {
        language_id: language.id,
        source_code: btoa(code),
        stdin: stdin ? btoa(stdin) : undefined,
        expected_output: expectedOutput ? btoa(expectedOutput) : undefined
    };

    try {
        const response = await compiler.post<Judge0ResponseNoWait>(
            '/submissions?base64_encoded=true&wait=false',
            submission
        );
        const token = response.data.token;
        return token;
    } catch (error: unknown) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'response' in error &&
            'message' in error
        ) {
            const err = error as {
                response?: { data?: { message?: string } };
                message?: string;
            };
            console.error(
                'Error calling Judge0 API:',
                err.response?.data || err.message
            );
            throw new Error(
                `API Error: ${
                    err.response?.data?.message ||
                    err.message ||
                    'Unknown error'
                }`
            );
        } else {
            console.error('Error calling Judge0 API:', error);
            throw new Error('API Error: Unknown error');
        }
    }
};

export default runCode;
