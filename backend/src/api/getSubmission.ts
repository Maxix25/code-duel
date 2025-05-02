import compiler from './compiler';

interface Judge0Response {
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
export default getSubmission;
