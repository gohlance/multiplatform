import BaseApiService from './BaseApiService';
import { ApiResponse, ProductUploadResponse } from './types';
import { Product } from '../../types';
import { createHmac } from 'crypto';

export default class ShopeeService extends BaseApiService {
  private readonly baseUrl = 'https://partner.shopeemobile.com/api/v2';

  private generateSignature(path: string, timestamp: number): string {
    const payload = `${this.config.apiKey}${path}${timestamp}`;
    return createHmac('sha256', this.config.apiSecret || '')
      .update(payload)
      .digest('hex');
  }

  async uploadProduct(product: Product): Promise<ApiResponse<ProductUploadResponse>> {
    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const path = '/product/add_item';
      const signature = this.generateSignature(path, timestamp);

      const response = await this.fetchWithAuth(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopee-Signature': signature,
          'X-Shopee-Timestamp': timestamp.toString(),
        },
        body: JSON.stringify({
          shop_id: parseInt(this.config.shopId || '0'),
          item: {
            name: product.title,
            description: product.description,
            price: parseFloat(product.price),
            stock: parseInt(product.quantity),
            images: product.images,
            category_id: product.category,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload product to Shopee');
      }

      return {
        success: true,
        data: {
          productId: data.item_id,
          status: 'success',
          platformUrl: `https://shopee.com/product/${data.item_id}`,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}