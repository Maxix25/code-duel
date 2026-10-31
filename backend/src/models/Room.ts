import mongoose, { Schema, Document, InferRawDocType, Types } from 'mongoose';
import { hash, genSalt, compare } from 'bcryptjs';

const roomSchemaDefinition = {
    players: [
        {
            player: {
                type: Schema.Types.ObjectId,
                ref: 'Player',
                required: true
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
};

type InferredRoom = InferRawDocType<typeof roomSchemaDefinition>;
type IRoom = Omit<InferredRoom, 'players' | 'problemId'> & {
    players: Omit<InferredRoom['players'][number], '_id'>[];
    problemId: Types.ObjectId;
};

/**
 * Room document.
 * @property players - Players in the room.
 * @property status - The room status.
 * @property problemId - The room question.
 * @property name - The room name.
 * @property maxCapacity - The player limit.
 */
export interface Room extends IRoom, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const RoomSchema = new Schema(roomSchemaDefinition);

// Ensure no duplicate players in a room
RoomSchema.index(
    { 'players.player': 1 },
    {
        unique: true,
        partialFilterExpression: { 'players.player': { $exists: true } }
    }
);

RoomSchema.pre<Room>('save', async function () {
    // Don't hash empty passwords (for public rooms)
    if (!this.password || this.password === '' || !this.isModified('password'))
        return;

    try {
        const salt = await genSalt(10);
        this.password = await hash(this.password, salt);
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error hashing password');
    }
});

RoomSchema.methods.comparePassword = function (
    candidatePassword: string
): Promise<boolean> {
    return compare(candidatePassword, this.password);
};

export default mongoose.model<Room>('Room', RoomSchema);
