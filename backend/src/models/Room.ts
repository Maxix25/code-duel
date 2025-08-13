import mongoose, { Schema, Document } from 'mongoose';
import type { Player } from './Player';
import { hash, genSalt, compare } from 'bcryptjs';

export interface Room extends Document {
    players: {
        player: Player | Schema.Types.ObjectId;
        score: number;
        ready: boolean;
        current_code: string;
    }[];
    status: 'waiting' | 'playing' | 'finished';
    problemId: Schema.Types.ObjectId;
    createdAt: Date;
    name: string;
    password: string;
    maxCapacity: number;
    comparePassword(candidatePassword: string): Promise<boolean>;
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
    },
    password: {
        type: String,
        maxlength: 100
    },
    maxCapacity: {
        type: Number,
        default: 4,
        max: 10
    }
});

RoomSchema.pre<Room>('save', async function (next) {
    // Don't hash empty passwords (for public rooms)
    if (!this.password || this.password === '' || !this.isModified('password'))
        return next();

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

RoomSchema.methods.comparePassword = function (
    candidatePassword: string
): Promise<boolean> {
    return compare(candidatePassword, this.password);
};

export default mongoose.model<Room>('Room', RoomSchema);
