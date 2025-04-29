import api from '../api';

interface TestCase {
    stdin: string;
    expectedOutput: string;
}
interface QuestionDocument extends Document {
    question: string;
    testCases: TestCase[];
    difficulty: number;
    startingCode: string;
}

const getQuestion = async (): Promise<QuestionDocument> => {
    try {
        const response = await api.get(`/room/question`);
        return response.data;
    } catch (error) {
        console.error('Error fetching question:', error);
        throw error;
    }
};
export default getQuestion;
