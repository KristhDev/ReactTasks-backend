import { Schema, model } from 'mongoose';

/* Interfaces */
import { IEmailVerification } from '../interfaces'

const emailVerificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [ true, 'El usuario es requerido.' ]
    },
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
    collection: 'emailVerifications'
});

const EmailVerification = model<IEmailVerification>('EmailVerification', emailVerificationSchema);

export default EmailVerification;