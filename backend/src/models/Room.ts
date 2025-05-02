import mongoose, { Schema, Document } from 'mongoose';

export interface Room extends Document {
    players: mongoose.Types.ObjectId[];
    status: 'waiting' | 'playing' | 'finished';
    problemId: Schema.Types.ObjectId;
    createdAt: Date;
}

const RoomSchema: Schema = new Schema({
    players: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Player',
            default: [],
        },
    ],
    status: {
        type: String,
        enum: ['waiting', 'playing', 'finished'],
        default: 'waiting',
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'Question',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<Room>('Room', RoomSchema);
