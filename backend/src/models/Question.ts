import mongoose, { Schema, Document, InferRawDocType } from 'mongoose';

const testCaseSchemaDefinition = {
    stdin: { type: String, required: true },
    expectedOutput: { type: String, required: true },
    isPrivate: { type: Boolean, required: true }
};

type TestCaseDocument = InferRawDocType<typeof testCaseSchemaDefinition>;

/** Test case for a question. */
export type TestCase = TestCaseDocument;

const questionSchemaDefinition = {
    question: { type: String, required: true },
    testCases: {
        type: [testCaseSchemaDefinition],
        required: true
    },
    difficulty: { type: Number, required: true, min: 1, max: 5 },
    startingCode: { type: String, required: true }
};

/**
 * Question document.
 * @property question - The question text.
 * @property testCases - The test cases.
 * @property difficulty - The difficulty level.
 * @property startingCode - The starting code.
 */
export interface QuestionDocument
    extends InferRawDocType<typeof questionSchemaDefinition>,
        Document {}

const QuestionSchema = new Schema<QuestionDocument>(questionSchemaDefinition);
const Question = mongoose.model<QuestionDocument>('Question', QuestionSchema);
export default Question;

/** Fetch a random question. */

export async function getRandomQuestion() {
    const result = await Question.aggregate([{ $sample: { size: 1 } }]);
    console.log(result);
    return result[0];
}
