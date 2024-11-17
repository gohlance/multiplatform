import BaseApiService from './BaseApiService';
import { ApiResponse, ProductUploadResponse } from './types';
import { Product } from '../../types';

export default class EtsyService extends BaseApiService {
  private readonly baseUrl = 'https://openapi.etsy.com/v3';

  async uploadProduct(product: Product): Promise<ApiResponse<ProductUploadResponse>> {
    try {
      // First, create the listing
      const listingResponse = await this.fetchWithAuth(`${this.baseUrl}/application/shops/${this.config.shopId}/listings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
        },
        body: JSON.stringify({
          quantity: parseInt(product.quantity),
          title: product.title,
          description: product.description,
          price: {
            amount: parseFloat(product.price),
            divisor: 100,
            currency_code: 'USD',
          },
          who_made: 'i_did',
          when_made: '2020_2024',
          taxonomy_id: product.category,
          is_digital: false,
        }),
      });

      const listingData = await listingResponse.json();

      if (!listingResponse.ok) {
        throw new Error(listingData.error || 'Failed to create Etsy listing');
      }

      // Upload images sequentially
      for (const imageUrl of product.images) {
        await this.fetchWithAuth(
          `${this.baseUrl}/application/shops/${this.config.shopId}/listings/${listingData.listing_id}/images`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': this.config.apiKey,
            },
            body: JSON.stringify({
              image_url: imageUrl,
            }),
          }
        );
      }

      return {
        success: true,
        data: {
          productId: listingData.listing_id.toString(),
          status: 'success',
          platformUrl: `https://www.etsy.com/listing/${listingData.listing_id}`,
        },
      };
    } catch (error) {
      return this.handleError(error);
    }
  }
}