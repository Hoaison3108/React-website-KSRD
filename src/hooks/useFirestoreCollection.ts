import { useState, useEffect, useRef } from 'react';
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
      ...doc.data(),
      id: doc.id
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

  // Sử dụng useRef để lưu trữ mảng queries và chỉ update khi có sự thay đổi thực sự
  const queriesRef = useRef(options.queries);
  useEffect(() => {
    if (JSON.stringify(options.queries) !== JSON.stringify(queriesRef.current)) {
      queriesRef.current = options.queries;
    }
  }, [options.queries]);
  
  useEffect(() => {
    if (!options.realtime) {
      fetchCollection();
      return;
    }

    setLoading(true);
    const q = query(collection(db, collectionName), ...(queriesRef.current || []));
    
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
  }, [collectionName, queriesRef.current, options.realtime]); // Dependency dựa vào ref.current (đã memoized)

  return { data, loading, error, refetch: fetchCollection };
}
