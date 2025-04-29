import compiler from './compiler';

export const LANGUAGES = {
    python: { id: 71, name: 'Python' },
    javascript: { id: 63, name: 'JavaScript' },
};

interface Judge0Submission {
    language_id: number;
    source_code: string;
    stdin?: string;
}

interface Judge0Response {
    stdout: string | null;
    stderr: string | null;
    compile_output: string | null;
    message: string | null;
    status: {
        id: number;
        description: string;
    };
    time: string | null;
    memory: number | null;
    token: string;
}

const runCode = async (
    code: string,
    languageName: keyof typeof LANGUAGES,
    stdin?: string
): Promise<Judge0Response> => {
    const language = LANGUAGES[languageName];
    if (!language) {
        throw new Error(`Unsupported language: ${languageName}`);
    }

    const submission: Judge0Submission = {
        language_id: language.id,
        source_code: btoa(code),
        stdin: stdin ? btoa(stdin) : undefined,
    };

    try {
        const response = await compiler.post<Judge0Response>(
            '/submissions?base64_encoded=true&wait=true',
            submission
        );

        const decodedResponse: Judge0Response = {
            ...response.data,
            stdout: response.data.stdout ? atob(response.data.stdout) : null,
            stderr: response.data.stderr ? atob(response.data.stderr) : null,
            compile_output: response.data.compile_output
                ? atob(response.data.compile_output)
                : null,
            message: response.data.message ? atob(response.data.message) : null,
        };

        return decodedResponse;
    } catch (error: any) {
        console.error(
            'Error calling Judge0 API:',
            error.response?.data || error.message
        );
        throw new Error(
            `API Error: ${
                error.response?.data?.message ||
                error.message ||
                'Unknown error'
            }`
        );
    }
};

export default runCode;
