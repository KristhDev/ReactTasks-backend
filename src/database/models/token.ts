import { Schema, model } from 'mongoose';

/* Interfaces */
import { IToken } from '../interfaces'

const tokenSchema = new Schema({
    token: {
        type: String,
        required: [ true, 'El token es requerido.' ]
    },
    expiresIn: {
        type: String,
        required: [ true, 'La fecha de expiración es requerida.' ]
    }
}, {
    timestamps: true,
    collection: 'tokens'
});

const Token = model<IToken>('Token', tokenSchema);

export default Token;