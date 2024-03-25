export interface UserEndpoint {
    id: string;
    name: string;
    lastname: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}
export interface UserType {
    id: string;
    name: string;
    lastname: string;
    email: string;
    verified: boolean;
    password?: string;
    createdAt: string;
    updatedAt: string;
}

export interface VerificationType {
    id: string;
    userId: string;
    token: string;
    type: 'email' | 'password';
    expiresIn: string;
    createdAt: string;
    updatedAt: string;
}