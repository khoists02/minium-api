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
    description?: string;
    backgroundUrl?: string;
    userId?: string;
}

export interface IPublicPostResponse {
    id?: string;
    title?: string;
    content?: string;
    description?: string;
    backgroundUrl?: string;
    author?: string;
    updatedAt?: Date | string;
}

export interface ICommentResponse {
    id?: string;
    content?: string;
    author?: {
        id?: string;
        name?: string;
    }
}