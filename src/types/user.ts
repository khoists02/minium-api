export interface IUserResponse {
    id?: string;
    name?: string;
    email?: string;
    updatedAt?: Date | string;
}

export interface IPostResponse {
    id?: string;
    title?: string;
    content?: string;
    userId?: string;
}