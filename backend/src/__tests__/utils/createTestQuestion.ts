import Question from '../../models/Question';

const createTestQuestion = async () => {
    const question = await Question.create({
        question: 'Write a function that returns the sum of two numbers.',
        testCases: [
            {
                stdin: '2\n3',
                expectedOutput: '5',
            },
            {
                stdin: '10\n20',
                expectedOutput: '30',
            },
            {
                stdin: '-5\n5',
                expectedOutput: '0',
            },
        ],
        difficulty: 1,
        startingCode:
            'def sum_two_numbers(a, b):\n    # Write your code\n\nprint(sum_two_numbers(int(input()), int(input())))',
    });
    return question;
};

export default createTestQuestion;
