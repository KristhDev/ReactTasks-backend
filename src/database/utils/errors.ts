export class DatabaseError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'DatabaseError';
    }
}

export class SeederError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'SeederError';
    }
}