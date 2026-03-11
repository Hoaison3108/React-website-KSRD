import { useFirestoreDoc } from './useFirestoreDoc';

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
  };
  contactPageInfo?: {
    address: string;
    phone: string;
    email: string;
  };
}

export function useSiteSettings() {
  const { data: settings, loading, error, updateDoc } = useFirestoreDoc<SiteSettings>(
    'site_settings', 
    'main', 
    { realtime: true }
  );

  return { settings, loading, error, updateSettings: updateDoc };
}
