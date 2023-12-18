import { Schema, model } from 'mongoose';

/* Interfaces */
import { ITask } from '../interfaces';

const taskSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: [ true, 'El usuario es requerido.' ]
    },
    title: {
        type: String,
        required: [ true, 'El titulo es requerido.' ]
    },
    description: {
        type: String,
        required: [ true, 'La descripción es requerida.' ]
    },
    image: {
        type: String,
        required: false
    }
}, {
    timestamps: true,
    collection: 'tasks',
});

const Task = model<ITask>('Task', taskSchema);

export default Task;