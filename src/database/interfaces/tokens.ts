export interface IToken {
    _id: string;
    token: string;
    expiresIn: string;
    createdAt?: string;
    updatedAt?: string;
}