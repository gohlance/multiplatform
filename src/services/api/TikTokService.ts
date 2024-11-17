import BaseApiService from './BaseApiService';
import { ApiResponse, ProductUploadResponse } from './types';
import { Product } from '../../types';

export default class TikTokService extends BaseApiService {
  private readonly baseUrl = 'https://open-api.tiktokglobalshop.com';

  private generateSignature(path: string, timestamp: number, params: Record<string, any>): string {
    const signStr = `${path}${timestamp}${JSON.stringify(params)}${this.config.apiSecret}`;
    return require('crypto').createHmac('sha256', this.config.apiSecret || '')
      .update(signStr)
      .digest('hex');
  }

  async uploadProduct(product: Product): Promise<ApiResponse<ProductUploadResponse>> {
    try {
      const timestamp = Date.now();
      const path = '/api/products/products';
      
      const productData = {
        product_name: product.title,
        description: product.description,
        category_id: product.category,
        price: {
          original_price: product.price,
          currency: "USD"
        },
        stock_info: {
          quantity: parseInt(product.quantity)
        },
        images: product.images.map(url => ({ url })),
      };

      const signature = this.generateSignature(path, timestamp, productData);

      const response = await this.fetchWithAuth(`${this.baseUrl}${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-app-key': this.config.apiKey,
          'x-shop-id': this.config.shopId,
          'x-timestamp': timestamp.toString(),
          'x-signature': signature,
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload product to TikTok Shop');
      }

      return {
        success: true,
        data: {
          productId: data.product_id,
          status: 'success',
          platformUrl: `https://shop.tiktok.com/product/${data.product_id}`,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}