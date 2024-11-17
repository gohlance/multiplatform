import { Platform, Product } from '../types';
import { 
  ShopeeService, 
  LazadaService, 
  EtsyService, 
  TikTokService,
  ApiConfig,
  ProductUploadResponse,
  ApiResponse 
} from './api';

export class ProductUploadService {
  private services: Map<Platform, BaseApiService>;

  constructor(configs: Record<Platform, ApiConfig>) {
    this.services = new Map([
      ['shopee', new ShopeeService(configs.shopee)],
      ['lazada', new LazadaService(configs.lazada)],
      ['etsy', new EtsyService(configs.etsy)],
      ['tiktok', new TikTokService(configs.tiktok)],
    ]);
  }

  async uploadToMultiplePlatforms(
    product: Product,
    platforms: Platform[]
  ): Promise<Record<Platform, ApiResponse<ProductUploadResponse>>> {
    const results: Record<Platform, ApiResponse<ProductUploadResponse>> = {} as any;

    await Promise.all(
      platforms.map(async (platform) => {
        const service = this.services.get(platform);
        if (service) {
          results[platform] = await service.uploadProduct(product);
        }
      })
    );

    return results;
  }
}