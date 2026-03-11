import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export interface SiteSettings {
  hero: {
    title: string;
    subtitle: string;
    backgroundImage: string;
  };
  services: {
    title: string;
    description: string;
    icon: string;
  }[];
  footerInfo: {
    address: string;
    phone: string;
    email: string;
    workingHours?: string;
  };
  contactPageInfo: {
    address: string;
    phone: string;
    email: string;
    workingHours: string;
  };
}

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const docRef = doc(db, 'site_settings', 'main');
    
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setSettings(docSnap.data() as SiteSettings);
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching site settings:", err);
      setError(err as Error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { settings, loading, error };
}
