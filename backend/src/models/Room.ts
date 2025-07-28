import mongoose, { Schema, Document } from 'mongoose';
import type { Player } from './Player';

export interface Room extends Document {
    players: {
        player: Player | mongoose.Schema.Types.ObjectId;
        score: number;
        ready: boolean;
        current_code: string;
    }[];
    status: 'waiting' | 'playing' | 'finished';
    problemId: Schema.Types.ObjectId;
    createdAt: Date;
    name: string;
}

const RoomSchema: Schema = new Schema({
    players: [
        {
            player: {
                type: Schema.Types.ObjectId,
                ref: 'Player'
            },
            score: {
                type: Number,
                default: 0
            },
            ready: {
                type: Boolean,
                default: false
            },
            current_code: {
                type: String,
                default: ''
            }
        }
    ],
    status: {
        type: String,
        enum: ['waiting', 'playing', 'finished'],
        default: 'waiting'
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'Question'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    name: {
        type: String,
        required: true,
        maxlength: 100
    }
});

export default mongoose.model<Room>('Room', RoomSchema);
