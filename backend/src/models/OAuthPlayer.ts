import mongoose, { Schema, Document } from 'mongoose';
export interface OAuthPlayer extends Document {
    username: string;
    score: number;
    roomId: mongoose.Types.ObjectId;
    email: string;
    avatar: string;
    wins: number;
    losses: number;
    ties: number;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const playerSchema: Schema = new Schema({
    providerId: { type: String, unique: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    ties: { type: Number, default: 0 },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
    avatar: { type: String, default: '/uploads/avatars/default.png' }
});

export default mongoose.model<OAuthPlayer>('OAuthPlayer', playerSchema);
