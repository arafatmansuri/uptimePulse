type ApiResponse<T> = {
    data: T;
    message: string;
    success: boolean;
}

export type ApiErrorResponse = {
    message: string;
    success: boolean;
}

type User = {
    user:{
        id: string;
        email: string;
        name: string;
        password?: string;
    }
    token?: string;
}

export type AuthResponse = ApiResponse<User>;