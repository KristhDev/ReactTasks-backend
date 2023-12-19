export interface ITask {
    _id: string;
    userId: string;
    title: string;
    description: string;
    image?: string;
    deadline: string;
    createdAt?: string;
    updatedAt?: string;
}