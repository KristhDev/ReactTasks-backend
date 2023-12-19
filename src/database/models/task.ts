import { Schema, model } from 'mongoose';
import { mongoosePagination, Pagination } from 'mongoose-paginate-ts';

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
    },
    deadline: {
        type: String,
        required: [ true, 'La fecha de expiración es requerida.' ]
    },
    status: {
        type: String,
        enum: [ 'pending', 'completed', 'in-progress' ],
        default: 'pending'
    }
}, {
    timestamps: true,
    collection: 'tasks',
});

taskSchema.index({ title: 'text', description: 'text' });
taskSchema.plugin(mongoosePagination);

const Task = model<ITask, Pagination<ITask>>('Task', taskSchema);

export default Task;