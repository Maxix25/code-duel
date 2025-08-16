import Question from '../models/Question';
import { QuestionDocument } from '../models/Question';

const createTestQuestion = async () => {
    const question = await Question.create<Partial<QuestionDocument>>({
        question: 'Write a function that returns the sum of two numbers.',
        testCases: [
            {
                stdin: '2\n3',
                expectedOutput: '5',
                isPrivate: false
            },
            {
                stdin: '10\n20',
                expectedOutput: '30',
                isPrivate: false
            },
            {
                stdin: '-5\n5',
                expectedOutput: '0',
                isPrivate: true
            }
        ],
        difficulty: 1,
        startingCode:
            'def sum_two_numbers(a, b):\n    # Write your code\n\nprint(sum_two_numbers(int(input()), int(input())))'
    });
    return question;
};

export default createTestQuestion;
