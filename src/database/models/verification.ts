import { Schema, model } from 'mongoose';

/* Interfaces */
import { IVerification } from '../interfaces'

const verificationSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [ true, 'El usuario es requerido.' ]
    },
    token: {
        type: String,
        required: [ true, 'El token es requerido.' ]
    },
    type: {
        type: String,
        enum: [ 'email', 'password' ],
        required: [ true, 'El tipo de verificación es requerida.' ]
    },
    expiresIn: {
        type: String,
        required: [ true, 'La fecha de expiración es requerida.' ]
    }
}, {
    timestamps: true,
    collection: 'verifications'
});

const Verification = model<IVerification>('Verification', verificationSchema);

export default Verification;