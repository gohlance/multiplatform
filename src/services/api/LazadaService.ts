import BaseApiService from './BaseApiService';
import { ApiResponse, ProductUploadResponse } from './types';
import { Product } from '../../types';
import { createHmac } from 'crypto';

export default class LazadaService extends BaseApiService {
  private readonly baseUrl = 'https://api.lazada.com/rest';

  private generateSignature(params: Record<string, string>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}${params[key]}`)
      .join('');
    
    return createHmac('sha256', this.config.apiSecret || '')
      .update(sortedParams)
      .digest('hex');
  }

  async uploadProduct(product: Product): Promise<ApiResponse<ProductUploadResponse>> {
    try {
      const timestamp = Date.now().toString();
      const params = {
        app_key: this.config.apiKey,
        timestamp,
        sign_method: 'sha256',
        method: 'alibaba.product.create',
      };

      const signature = this.generateSignature(params);

      const response = await this.fetchWithAuth(`${this.baseUrl}/product/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.accessToken}`,
        },
        body: JSON.stringify({
          ...params,
          sign: signature,
          product_data: {
            name: product.title,
            description: product.description,
            price: product.price,
            quantity: parseInt(product.quantity),
            images: product.images,
            category_id: product.category,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error_message || 'Failed to upload product to Lazada');
      }

      return {
        success: true,
        data: {
          productId: data.product_id,
          status: 'success',
          platformUrl: `https://www.lazada.com/products/${data.product_id}`,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}