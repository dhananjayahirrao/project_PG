
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('flynest_token');
    const storedUser = localStorage.getItem('flynest_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('flynest_token', authToken);
    localStorage.setItem('flynest_user', JSON.stringify(userData));
    toast({
      title: "Welcome back! ✈️",
      description: "You've successfully logged in to Flynest.",
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('flynest_token');
    localStorage.removeItem('flynest_user');
    toast({
      title: "Logged out successfully",
      description: "See you next time!",
    });
  };

  const isAdmin = () => {
    return user?.role === 'admin' || user?.isAdmin === true;
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAdmin,
    isAuthenticated: !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
