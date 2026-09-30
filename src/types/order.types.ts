export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  sellerId?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  items: CartItem[];
  total: number;
  deliveryAddress: string;
  status: OrderStatus;
  createdAt: Date;
}
