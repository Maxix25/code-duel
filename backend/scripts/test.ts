import mongoose from 'mongoose';
import Question from '../src/models/Question';

async function main() {
    await mongoose.connect('mongodb://localhost:27017/code_duel'); // Update with your DB URI if needed

    const question = new Question({
        question: 'Write a function that returns the sum of two numbers.',
        testCases: [
            { stdin: '1 2', expectedOutput: '3' },
            { stdin: '10 5', expectedOutput: '15' },
            { stdin: '-1 1', expectedOutput: '0' },
        ],
        difficulty: 1,
        startingCode:
            'def sum_two_numbers(a, b):\n    # Write your code here\n    pass',
    });

    await question.save();
    console.log('Question inserted!');
    await mongoose.disconnect();
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
