import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Transaction, InsertTransaction } from "@shared/schema";

const TRANSACTIONS_COLLECTION = "transactions";

export class FirestoreService {
  static async createTransaction(
    userId: string,
    transaction: InsertTransaction
  ): Promise<string> {
    const docRef = await addDoc(collection(db, TRANSACTIONS_COLLECTION), {
      ...transaction,
      userId,
      createdAt: Timestamp.now().toDate().toISOString(),
      updatedAt: Timestamp.now().toDate().toISOString(),
    });
    return docRef.id;
  }

  static async updateTransaction(
    id: string,
    transaction: Partial<InsertTransaction>
  ): Promise<void> {
    const docRef = doc(db, TRANSACTIONS_COLLECTION, id);
    await updateDoc(docRef, {
      ...transaction,
      updatedAt: Timestamp.now().toDate().toISOString(),
    });
  }

  static async deleteTransaction(id: string): Promise<void> {
    const docRef = doc(db, TRANSACTIONS_COLLECTION, id);
    await deleteDoc(docRef);
  }

  static async getUserTransactions(userId: string): Promise<Transaction[]> {
    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where("userId", "==", userId),
      orderBy("date", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaction[];
  }

  static async getTransactionsByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<Transaction[]> {
    const q = query(
      collection(db, TRANSACTIONS_COLLECTION),
      where("userId", "==", userId),
      where("date", ">=", startDate),
      where("date", "<=", endDate),
      orderBy("date", "desc")
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Transaction[];
  }
}
