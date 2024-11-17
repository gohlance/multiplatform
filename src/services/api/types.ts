export interface ApiConfig {
  apiKey: string;
  apiSecret?: string;
  accessToken?: string;
  shopId?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

export interface ProductUploadResponse {
  productId: string;
  status: 'success' | 'pending' | 'failed';
  platformUrl?: string;
}