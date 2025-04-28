import compiler from '../compiler';

const submitCode = async (
    source_code: string,
    language_id: number,
    stdin?: string
) => {
    try {
        const encoded_code = Buffer.from(source_code).toString('base64');
        const encoded_stdin = stdin
            ? Buffer.from(stdin).toString('base64')
            : '';
        const response = await compiler.post(
            '/submissions',
            {
                encoded_code,
                language_id,
                encoded_stdin,
            },
            {
                params: {
                    wait: 'false',
                    base64_encoded: 'true',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error executing code', error);
        throw error;
    }
};

export default submitCode;
