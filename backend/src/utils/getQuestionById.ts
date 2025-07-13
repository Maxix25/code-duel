import mongoose from 'mongoose';
import Question from '../models/Question';

/**
 * Fetches a question document by its ID.
 * @param questionId - The MongoDB ObjectId of the question.
 * @returns The question document or null if not found.
 */
export default async function getQuestionById(questionId: string) {
    if (!mongoose.isValidObjectId(questionId)) {
        throw new Error('Invalid question ID');
    }
    return await Question.findById(questionId);
}
