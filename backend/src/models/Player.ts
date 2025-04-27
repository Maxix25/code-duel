import mongoose, { Schema, Document } from 'mongoose';
import { hash, genSalt, compare } from 'bcryptjs';
export interface Player extends Document {
    username: string;
    score: number;
    roomId: mongoose.Types.ObjectId;
    email: string;
    password: string;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Crear el Schema de Mongoose
const playerSchema: Schema = new Schema({
    username: { type: String, required: true, unique: true },
    score: { type: Number, default: 0 },
    roomId: { type: Schema.Types.ObjectId, ref: 'Room' },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Hook Pre-save para hashear la contraseña
playerSchema.pre<Player>('save', async function (next) {
    // Solo hashear la contraseña si ha sido modificada (o es nueva)
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

// Método para comparar contraseñas
playerSchema.methods.comparePassword = function (
    candidatePassword: string
): Promise<boolean> {
    return compare(candidatePassword, this.password);
};

// Crear y exportar el modelo
export default mongoose.model<Player>('Player', playerSchema);
