import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

interface UserRole {
  role: 'admin' | 'user';
  name?: string;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  role: 'admin' | 'user' | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<'admin' | 'user' | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Hardcode specific admin email based on user request
        if (user.email === 'hoaison3108@gmail.com') {
          setRole('admin');
          setIsAdmin(true);
        } else {
          // Fetch user role from Firestore for other users
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (userDoc.exists()) {
              const userData = userDoc.data() as UserRole;
              setRole(userData.role);
              setIsAdmin(userData.role === 'admin');
            } else {
               // Default rule: If no document exists in 'users' collection, assume they are just a 'user'. 
              setRole('user');
              setIsAdmin(false);
            }
          } catch (error) {
            console.error("Error fetching user role", error);
            setRole('user');
            setIsAdmin(false);
          }
        }
      } else {
        setRole(null);
        setIsAdmin(false);
      }
      
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    currentUser,
    loading,
    logout,
    role,
    isAdmin
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
