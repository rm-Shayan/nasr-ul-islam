import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "../Firebase/Firebase";
import { logout as externalLogout } from "../Firebase/firebase.utilities";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  pendingLogout: boolean;
  logout: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  pendingLogout: false,
  logout: async () => false, // default fallback
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingLogout, setPendingLogout] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async (): Promise<boolean> => {
    setPendingLogout(true);
    const result = await externalLogout(auth);
    setPendingLogout(false);
    return result;
  };

  return (
    <AuthContext.Provider value={{ user, loading, pendingLogout, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
