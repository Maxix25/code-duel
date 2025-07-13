import mongoose, { Schema, Document } from 'mongoose';
import type { Player } from './Player';

export interface Room extends Document {
    players: {
        player: Player | mongoose.Schema.Types.ObjectId;
        score: number;
    }[];
    status: 'waiting' | 'playing' | 'finished';
    problemId: Schema.Types.ObjectId;
    createdAt: Date;
}

const RoomSchema: Schema = new Schema({
    players: [
        {
            player: {
                type: Schema.Types.ObjectId,
                ref: 'Player',
            },
            score: {
                type: Number,
                default: 0,
            },
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
