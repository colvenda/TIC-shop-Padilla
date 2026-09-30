import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  updateDoc,
  doc,
  deleteDoc,
  orderBy,
} from 'firebase/firestore';
import { db } from '@/lib/firebase.config';
import { Product } from '@/types';
import { toDate } from '@/lib/utils';

function mapProduct(id: string, data: Record<string, unknown>): Product {
  return {
    id,
    name: String(data.name ?? ''),
    description: String(data.description ?? ''),
    price: Number(data.price ?? 0),
    category: String(data.category ?? ''),
    stock: Number(data.stock ?? 0),
    images: Array.isArray(data.images) ? (data.images as string[]) : [],
    sellerId: String(data.sellerId ?? ''),
    sellerName: data.sellerName ? String(data.sellerName) : undefined,
    createdAt: toDate(data.createdAt),
  };
}

export class ProductsService {
  static async getAllProducts(): Promise<Product[]> {
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => mapProduct(item.id, item.data()));
  }

  static async getProductsBySeller(sellerId: string): Promise<Product[]> {
    const q = query(
      collection(db, 'products'),
      where('sellerId', '==', sellerId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => mapProduct(item.id, item.data()));
  }

  static async createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
    const createdAt = new Date();
    const docRef = await addDoc(collection(db, 'products'), {
      ...product,
      createdAt,
    });
    return { id: docRef.id, ...product, createdAt };
  }

  static async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    await updateDoc(doc(db, 'products', productId), updates);
  }

  static async deleteProduct(productId: string): Promise<void> {
    await deleteDoc(doc(db, 'products', productId));
  }

  static async getProductById(productId: string): Promise<Product | null> {
    const docSnap = await getDoc(doc(db, 'products', productId));
    if (!docSnap.exists()) return null;
    return mapProduct(docSnap.id, docSnap.data());
  }
}
