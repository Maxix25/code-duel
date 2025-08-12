import mongoose, { Schema, Document } from 'mongoose';

/**
 * TestCase interface represents a single test case for a coding question.
 * @member stdin - The input to be provided to the code.
 * @member expectedOutput - The expected output from the code.
 */

export interface TestCase {
    stdin: string;
    expectedOutput: string;
}

/**
 * QuestionDocument interface represents a coding question document in the database.
 * @member question - The coding question text.
 * @member testCases - An array of test cases for the question.
 * @member difficulty - The difficulty level of the question (1 to 5).
 * @member startingCode - The initial code provided to the user.
 */

export interface QuestionDocument extends Document {
    question: string;
    testCases: TestCase[];
    difficulty: number;
    startingCode: string;
}

const TestCaseSchema = new Schema<TestCase>({
    stdin: { type: String, required: true },
    expectedOutput: { type: String, required: true }
});

const QuestionSchema = new Schema<QuestionDocument>({
    question: { type: String, required: true },
    testCases: { type: [TestCaseSchema], required: true },
    difficulty: { type: Number, required: true, min: 1, max: 5 },
    startingCode: { type: String, required: true }
});

export async function getRandomQuestion() {
    const Question = mongoose.model<QuestionDocument>('Question');
    const result = await Question.aggregate([{ $sample: { size: 1 } }]);
    return result[0];
}

export default mongoose.model<QuestionDocument>('Question', QuestionSchema);
