import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, getDocs, QueryConstraint, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../utils/firestoreUtils';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface UseFirestoreCollectionOptions {
  realtime?: boolean;
  queries?: QueryConstraint[];
}

export function useFirestoreCollection<T = DocumentData>(
  collectionName: string,
  options: UseFirestoreCollectionOptions = { realtime: false, queries: [] }
) {
  const queryClient = useQueryClient();
  
  // Memoize constraints signature for cache key (simplify by length for standard CMS cases)
  const constraintsKey = options.queries ? options.queries.length.toString() : 'all';
  const queryKey = ['firestore', collectionName, constraintsKey];

  const processSnapshot = (docs: QueryDocumentSnapshot<DocumentData>[]) => {
    return docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as (T & { id: string })[];
  };

  const fetchCollection = async () => {
    try {
      const q = query(collection(db, collectionName), ...(options.queries || []));
      const querySnapshot = await getDocs(q);
      return processSnapshot(querySnapshot.docs);
    } catch (err) {
      console.error(`Error fetching collection ${collectionName}:`, err);
      try {
         handleFirestoreError(err, OperationType.LIST, collectionName);
      } catch (e) {
         // Prevent crash
      }
      throw err;
    }
  };

  const { data: queryData, isLoading, error: queryError, refetch } = useQuery({
    queryKey,
    queryFn: fetchCollection,
    enabled: !options.realtime, // Chỉ xài query chuẩn nếu không phải luồng Realtime
    staleTime: 5 * 60 * 1000, // Cache 5 phút
  });

  // Handle realtime fallback
  const [realtimeData, setRealtimeData] = useState<(T & { id: string })[]>([]);
  const [realtimeLoading, setRealtimeLoading] = useState(true);
  const [realtimeError, setRealtimeError] = useState<Error | null>(null);

  useEffect(() => {
    if (!options.realtime) return;

    setRealtimeLoading(true);
    const q = query(collection(db, collectionName), ...(options.queries || []));
    
    // Set up realtime listener
    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const newData = processSnapshot(querySnapshot.docs);
        setRealtimeData(newData);
        queryClient.setQueryData(queryKey, newData); // Cập nhật cache ngầm
        setRealtimeLoading(false);
        setRealtimeError(null);
      },
      (err) => {
        console.error(`Error realtime fetching collection ${collectionName}:`, err);
        setRealtimeError(err as Error);
        setRealtimeLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName, constraintsKey, options.realtime, queryClient]);

  if (options.realtime) {
    return { 
      data: realtimeData.length > 0 ? realtimeData : (queryData || []), 
      loading: realtimeLoading && !queryData, 
      error: realtimeError, 
      refetch 
    };
  }

  return { 
    data: queryData || [], 
    loading: isLoading, 
    error: queryError as Error | null, 
    refetch 
  };
}
