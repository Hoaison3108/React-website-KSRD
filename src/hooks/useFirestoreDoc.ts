import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firestoreUtils';

interface UseFirestoreDocOptions {
  realtime?: boolean;
}

export function useFirestoreDoc<T = DocumentData>(
  collectionName: string, 
  documentId: string,
  options: UseFirestoreDocOptions = { realtime: false }
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDoc = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, collectionName, documentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setData(docSnap.data() as T);
      } else {
        setData(null);
      }
      setError(null);
    } catch (err) {
      console.error(`Error fetching ${collectionName}/${documentId}:`, err);
      setError(err as Error);
      try {
        handleFirestoreError(err, OperationType.GET, `${collectionName}/${documentId}`);
      } catch (e) {
        // Bắt lại lỗi từ handleFirestoreError ném ra để không crash app
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!options.realtime) {
      fetchDoc();
      return;
    }

    // Realtime listener
    const docRef = doc(db, collectionName, documentId);
    setLoading(true);
    const unsubscribe = onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setData(docSnap.data() as T);
        } else {
          setData(null);
        }
        setLoading(false);
        setError(null);
      }, 
      (err) => {
        console.error(`Error realtime fetching ${collectionName}/${documentId}:`, err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, documentId, options.realtime]);

  const updateDoc = async (newData: Partial<T> | T, merge: boolean = true) => {
    setLoading(true);
    try {
      const docRef = doc(db, collectionName, documentId);
      await setDoc(docRef, newData, { merge });
      
      // Update local state optimistic if not realtime to avoid re-fetch delay
      if (!options.realtime) {
         setData(prev => prev ? { ...prev, ...newData } as T : newData as T);
      }
      
      return true;
    } catch (err) {
      console.error(`Error updating ${collectionName}/${documentId}:`, err);
      try {
        handleFirestoreError(err, OperationType.UPDATE, `${collectionName}/${documentId}`);
      } catch (e) {
        // Catch error thrown by handler
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { 
    data, 
    loading, 
    error, 
    updateDoc, 
    refetch: fetchDoc // Manual refetch cho non-realtime
  };
}
