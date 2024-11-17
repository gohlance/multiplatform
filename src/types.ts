export type Platform = 'shopee' | 'lazada' | 'etsy' | 'tiktok';

export interface Product {
  title: string;
  description: string;
  price: string;
  quantity: string;
  category: string;
  images: string[];
}