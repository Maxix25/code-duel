import mongoose, { Schema, Document } from 'mongoose';
import { hash, genSalt, compare } from 'bcryptjs';
export interface Player extends Document {
    username: string;
    score: number;
    roomId: mongoose.Types.ObjectId;
    email: string;
    password: string;
    avatar: string;
    wins: number;
    losses: number;
    ties: number;
    accounts: { provider: string; providerId: string }[];
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const oAuthAccountSchema = new mongoose.Schema(
    {
        provider: {
            type: String,
            required: true // e.g., 'google', 'github', 'facebook'
        },
        providerId: {
            type: String,
            required: true
        }
    },
    { _id: false }
);

const playerSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    ties: { type: Number, default: 0 },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
    email: { type: String, required: true, unique: true },
    password: {
        type: String
    },
    accounts: [oAuthAccountSchema],
    avatar: { type: String, default: '/uploads/avatars/default.png' }
});

playerSchema.pre<Player>('save', async function (next) {
    // Skip password hashing for OAuth users or if password hasn't been modified
    if (!this.isModified('password')) return next();

    try {
        const salt = await genSalt(10);
        this.password = await hash(this.password, salt);
        next();
    } catch (error) {
        if (error instanceof Error) {
            return next(error);
        }
        return next(new Error('Error hashing password'));
    }
});

playerSchema.methods.comparePassword = function (
    candidatePassword: string
): Promise<boolean> {
    return compare(candidatePassword, this.password);
};

export default mongoose.model<Player>('Player', playerSchema);
