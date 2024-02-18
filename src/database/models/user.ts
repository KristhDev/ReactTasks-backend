import { Schema, model } from 'mongoose';

/* Interfaces */
import { IUser } from '../interfaces';

const userSchema = new Schema({
    name: {
        required: [ true, 'El nombre es requerido.' ],
        type: String
    },
    lastname: {
        required: [ true, 'Los apellidos son requeridos.' ],
        type: String
    },
    email: {
        required: [ true, 'El correo es requerido.' ],
        type: String,
        unique: [ true, 'El correo ya existe.' ]
    },
    verified: {
        default: false,
        type: Boolean
    },
    password: {
        minlength: [ 6, 'La contraseña debe tener al menos 6 caracteres.' ],
        required: [ true, 'La contraseña es requerida.' ],
        type: String,
    }
}, {
    timestamps: true,
    collection: 'users'
});

const User = model<IUser>('User', userSchema);

export default User;