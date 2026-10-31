import mongoose, { Schema, Document, InferRawDocType } from 'mongoose';
import { hash, genSalt, compare } from 'bcryptjs';

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

const playerSchemaDefiniton = {
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
};

const playerSchema: Schema = new Schema(playerSchemaDefiniton);
type IPlayer = InferRawDocType<typeof playerSchemaDefiniton>;

/**
 * Player document.
 * @property username - The username.
 * @property email - The email.
 * @property password - The password.
 * @property accounts - OAuth accounts.
 * @property avatar - The avatar path.
 */
export interface Player extends IPlayer, Document {
    comparePassword(candidatePassword: string): Promise<boolean>;
}

playerSchema.pre<Player>('save', async function () {
    // Skip password hashing for OAuth users or if password hasn't been modified
    if (!this.isModified('password')) return;
    const password = this.password;
    if (!password) return;

    try {
        const salt = await genSalt(10);
        this.password = await hash(password, salt);
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error('Error hashing password');
    }
});

playerSchema.methods.comparePassword = function (
    candidatePassword: string
): Promise<boolean> {
    return compare(candidatePassword, this.password);
};

const PlayerModel =
    mongoose.models.Player || mongoose.model<Player>('Player', playerSchema);

export default PlayerModel;
