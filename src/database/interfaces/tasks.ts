export interface ITask {
    _id: string;
    userId: string;
    title: string;
    description: string;
    image?: string;
    createdAt?: string;
    updatedAt?: string;
}