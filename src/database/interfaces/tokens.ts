import { Document } from 'mongoose';

export interface IToken {
    _id: string;
    token: string;
    expiresIn: string;
    createdAt?: string;
    updatedAt?: string;
}

export type TokenModel = Document<unknown, {}, IToken> & IToken & Required<{ _id: string; }>;

export interface TokenFilter {
    id?: string;
    token?: string;
    expiresIn?: string;
}

export interface CreateTokenData {
    token: string;
    expiresIn: string;
}