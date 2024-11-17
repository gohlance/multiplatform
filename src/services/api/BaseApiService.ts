import { ApiConfig, ApiResponse } from './types';

export default abstract class BaseApiService {
  protected config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  protected async fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const headers = new Headers(options.headers);
    headers.set('Authorization', `Bearer ${this.config.accessToken}`);
    
    return fetch(url, {
      ...options,
      headers,
    });
  }

  protected handleError(error: unknown): ApiResponse<never> {
    if (error instanceof Error) {
      return {
        success: false,
        error: {
          code: 'UNKNOWN_ERROR',
          message: error.message,
        },
      };
    }
    return {
      success: false,
      error: {
        code: 'UNKNOWN_ERROR',
        message: 'An unknown error occurred',
      },
    };
  }
}