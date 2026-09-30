import { collection, getDocs, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase.config';
import { User, UserRole } from '@/types';
import { toDate } from '@/lib/utils';

function mapUser(id: string, data: Record<string, unknown>): User {
  return {
    id,
    email: String(data.email ?? ''),
    name: String(data.name ?? ''),
    role: (data.role as UserRole) || 'buyer',
    createdAt: toDate(data.createdAt),
  };
}

export class UsersService {
  static async getAllUsers(): Promise<User[]> {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map((item) => mapUser(item.id, item.data()));
  }

  static async getUsersByRole(role: UserRole): Promise<User[]> {
    const q = query(collection(db, 'users'), where('role', '==', role));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((item) => mapUser(item.id, item.data()));
  }

  static async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    await updateDoc(doc(db, 'users', userId), updates);
  }

  static async deleteUser(userId: string): Promise<void> {
    await deleteDoc(doc(db, 'users', userId));
  }
}
