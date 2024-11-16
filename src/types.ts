import type { AuthInfo } from "./middleware/auth";

export interface CustomEnv {
  Variables: {
    user?: AuthInfo;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface URLStats {
  id: number;
  originalUrl: string;
  shortCode: string;
  clicks: number;
  createdAt: Date;
}