import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  doc,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase.config';
import { Order, OrderStatus } from '@/types';
import { toDate } from '@/lib/utils';

function mapOrder(id: string, data: Record<string, unknown>): Order {
  return {
    id,
    buyerId: String(data.buyerId ?? ''),
    buyerName: String(data.buyerName ?? ''),
    buyerEmail: String(data.buyerEmail ?? ''),
    items: Array.isArray(data.items) ? (data.items as Order['items']) : [],
    total: Number(data.total ?? 0),
    deliveryAddress: String(data.deliveryAddress ?? ''),
    status: (data.status as OrderStatus) || 'pending',
    createdAt: toDate(data.createdAt),
  };
}

export class OrdersService {
  static async getAllOrders(): Promise<Order[]> {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => mapOrder(item.id, item.data()));
  }

  static async getOrdersByBuyer(buyerId: string): Promise<Order[]> {
    const q = query(
      collection(db, 'orders'),
      where('buyerId', '==', buyerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => mapOrder(item.id, item.data()));
  }

  static async createOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<Order> {
    const createdAt = new Date();
    const docRef = await addDoc(collection(db, 'orders'), {
      ...order,
      createdAt,
    });
    return { id: docRef.id, ...order, createdAt };
  }

  static async updateOrder(orderId: string, updates: Partial<Order>): Promise<void> {
    await updateDoc(doc(db, 'orders', orderId), updates);
  }
}
