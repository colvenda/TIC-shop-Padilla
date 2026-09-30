export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  sellerId: string;
  sellerName?: string;
  createdAt: Date;
}
