import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User as FirebaseUser 
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import axios from 'axios';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

interface UserProfile {
  _id: string;
  firebaseId: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: string;
}

interface AuthContextType {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    return onAuthStateChanged(auth, async (fUser) => {
      setFirebaseUser(fUser);
      if (fUser) {
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
            firebaseId: fUser.uid,
            email: fUser.email,
            displayName: fUser.displayName,
            photoURL: fUser.photoURL
          });
          setUser(res.data.user);
          localStorage.setItem('token', res.data.token);
        } catch (err) {
          console.error("Auth backend error:", err);
        }
      } else {
        setUser(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });
  }, []);

  const login = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
