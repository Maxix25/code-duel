import mongoose, { Schema, Document } from 'mongoose';

export interface Room extends Document {
    name: string;
    players: mongoose.Types.ObjectId[];
    status: 'waiting' | 'playing' | 'finished';
    problemId?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const RoomSchema: Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    players: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Player',
        },
    ],
    status: {
        type: String,
        enum: ['waiting', 'playing', 'finished'],
        default: 'waiting',
    },
    problemId: {
        type: Schema.Types.ObjectId,
        ref: 'Problem',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model<Room>('Room', RoomSchema);
