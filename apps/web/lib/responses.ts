type ApiResponse<T> = {
  data: T;
  message: string;
  success: boolean;
};

export type ApiErrorResponse = {
  message: string;
  success: boolean;
  status: number;
};

export type User = {
  id: string;
  email: string;
  name: string;
  password?: string;
};

export type Website = {
  id: string;
  url: string;
  description?: string;
  userId: string;
  timeAdded: Date;
  ticks: Tick[];
};
export type WebsiteDetails = {
  id: string;
  url: string;
  status: WebsiteStatus;
  responseTime: number;
  uptimePercentage: number;
  lastChecked: string;
  description?: string;
  userId: string;
  timeAdded: Date;
  ticks: Tick[];
  _count: {
    ticks: number;
  };
};

export enum WebsiteStatus {
  UP = "UP",
  DOWN = "DOWN",
  Unknown = "Unknown",
}

export type Tick = {
  id: string;
  response_time_ms: number;
  status: WebsiteStatus;
  websiteId: string;
  regionId: string;
  createdAt: Date;
  isTempTick: boolean;
};

export type Region = {
  id: string;
  name: string;
};

export type AuthResponse = ApiResponse<{ user: User; token?: string }>;
export type WebsiteResponse = ApiResponse<{
  website: Website;
  tickCount: number;
  upCount: number;
  downCount: number;
  avgResponseTime: number;
}>;
export type WebsitesResponse = ApiResponse<{ websites: Website[] }>;
