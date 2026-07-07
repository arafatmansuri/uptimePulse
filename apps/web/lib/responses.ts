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


export type Website = {
    id: string;
    url: string;
    description?: string;
    userId: string;
    timeAdded: Date;
    ticks: Tick[];
}

export enum WebsiteStatus {
  UP="UP",
  DOWN="DOWN",
  Unknown="Unknown"
}

type Tick = {
    id: string;
    response_time_ms: number;
    status: WebsiteStatus;
    websiteId: string;
    regionId: string;
    createdAt: Date;
}

type Region = {
  id: string;
  name: string;
}

export type AuthResponse = ApiResponse<User>;
export type WebsiteResponse = ApiResponse<{website:Website}>;
export type WebsitesResponse = ApiResponse<{websites: Website[]}>;