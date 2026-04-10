// contexts/refreshContext.ts
import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface RefreshContextType {
  triggerRefresh: () => void;
  registerRefresh: (callback: () => void) => void;
}

const RefreshContext = createContext<RefreshContextType | null>(null);

export function RefreshProvider({ children }: { children: ReactNode }) {
  const [callback, setCallback] = useState<(() => void) | null>(null);

  const registerRefresh = useCallback((cb: () => void) => {
    setCallback(() => cb);
  }, []);

  const triggerRefresh = useCallback(() => {
    if (callback) callback();
  }, [callback]);

  return (
    <RefreshContext.Provider value={{ triggerRefresh, registerRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
}

export const useRefresh = () => {
  const ctx = useContext(RefreshContext);
  if (!ctx) throw new Error('useRefresh must be used within RefreshProvider');
  return ctx;
};