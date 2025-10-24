// src/context/UserContext.tsx
'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  created_at: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  loading: false,
  error: null,
  refreshUser: async () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`http://localhost:5000/users/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user data: ${response.status}`);
      }
      
      const userData = await response.json();
      console.log('Fetched user data from API:', userData);
      
      // Update localStorage with fresh data
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
    } catch (err: any) {
      console.error('Error fetching user data:', err);
      setError(err.message);
      
      // On error, clear invalid data
      localStorage.removeItem('user');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (user?.id) {
      await fetchUserData(user.id);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = localStorage.getItem('user');
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log('Loaded user from localStorage:', userData);
          
          // If we have a user ID, fetch fresh data from API
          if (userData?.id) {
            await fetchUserData(userData.id);
          } else {
            // If no ID, the stored data is invalid
            console.warn('Stored user data missing ID, clearing...');
            localStorage.removeItem('user');
            setUser(null);
          }
        } catch (error) {
          console.error('Error parsing user data from localStorage:', error);
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        console.log('No user found in localStorage');
        setUser(null);
      }
    };

    // Load user on mount
    loadUser();

    // Listen for localStorage changes (for cross-tab updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user') {
        console.log('localStorage user changed, reloading...');
        loadUser();
      }
    };

    // Listen for custom user update events
    const handleUserUpdate = () => {
      console.log('Custom user update event received, reloading...');
      loadUser();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userUpdated', handleUserUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleUserUpdate);
    };
  }, []);

  const contextValue: UserContextType = {
    user,
    setUser: (newUser: User | null) => {
      if (newUser) {
        localStorage.setItem('user', JSON.stringify(newUser));
        setUser(newUser);
      } else {
        localStorage.removeItem('user');
        setUser(null);
      }
      // Trigger event for other components
      window.dispatchEvent(new Event('userUpdated'));
    },
    loading,
    error,
    refreshUser,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);