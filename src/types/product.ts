export type ProductCategory = 'extra-virgin' | 'infused' | 'organic' | 'gift-sets';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: ProductCategory;
  size: string;
  inStock: boolean;
  featured: boolean;
  rating: number;
  reviews: number;
}
