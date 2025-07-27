import compiler from './compiler';

export interface Judge0Response {
    stdout: string | null;
    stderr: string | null;
    compile_output: string | null;
    message: string | null;
    status_id: number;
    token: string;
}

const getSubmission = async (token: string): Promise<Judge0Response> => {
    try {
        const response = await compiler.get(
            `/submissions/${token}?base64_encoded=true&fields=status_id,stdout,stderr,compile_output,message,token`
        );

        return response.data;
    } catch (error: unknown) {
        if (
            typeof error === 'object' &&
            error !== null &&
            'response' in error
        ) {
            interface ErrorResponseData {
                message?: string;
                [key: string]: unknown;
            }
            const err = error as {
                response?: { data?: ErrorResponseData };
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
            throw new Error(`API Error: ${String(error)}`);
        }
    }
};
export default getSubmission;
