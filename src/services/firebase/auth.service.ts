import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase.config';
import { User, UserRole } from '@/types';
import { toDate } from '@/lib/utils';

export class AuthService {
  static onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  }

  static async register(
    email: string,
    password: string,
    name: string,
    role: UserRole
  ): Promise<User> {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    const newUser: User = {
      id: user.uid,
      email,
      name,
      role,
      createdAt: new Date(),
    };

    await setDoc(doc(db, 'users', user.uid), newUser);
    return newUser;
  }

  static async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  }

  static async logout(): Promise<void> {
    await signOut(auth);
  }

  static async getUserById(userId: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, 'users', userId));
    if (!userDoc.exists()) return null;

    const data = userDoc.data();
    return {
      id: userDoc.id,
      email: data.email,
      name: data.name,
      role: data.role,
      createdAt: toDate(data.createdAt),
    };
  }
}
