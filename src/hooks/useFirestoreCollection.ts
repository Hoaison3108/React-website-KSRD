import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getDocs, QueryConstraint, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firestoreUtils';

interface UseFirestoreCollectionOptions {
  realtime?: boolean;
  queries?: QueryConstraint[];
}

export function useFirestoreCollection<T = DocumentData>(
  collectionName: string,
  options: UseFirestoreCollectionOptions = { realtime: false, queries: [] }
) {
  const [data, setData] = useState<(T & { id: string })[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  const processSnapshot = (docs: QueryDocumentSnapshot<DocumentData>[]) => {
    return docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as (T & { id: string })[];
  };

  const fetchCollection = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, collectionName), ...(options.queries || []));
      const querySnapshot = await getDocs(q);
      setData(processSnapshot(querySnapshot.docs));
      setError(null);
    } catch (err) {
      console.error(`Error fetching collection ${collectionName}:`, err);
      setError(err as Error);
      try {
         handleFirestoreError(err, OperationType.LIST, collectionName);
      } catch (e) {
         // Prevent crash
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!options.realtime) {
      fetchCollection();
      return;
    }

    setLoading(true);
    const q = query(collection(db, collectionName), ...(options.queries || []));
    
    // Set up realtime listener
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        setData(processSnapshot(querySnapshot.docs));
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error(`Error realtime fetching collection ${collectionName}:`, err);
        setError(err as Error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, JSON.stringify(options.queries), options.realtime]); // stringify queries an toàn cho useEffect dependency nếu mảng nông

  return { data, loading, error, refetch: fetchCollection };
}
