import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('fairway_token');
      const storedUser = localStorage.getItem('fairway_user');
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Error loading stored auth data:', e);
      localStorage.removeItem('fairway_token');
      localStorage.removeItem('fairway_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData) => {
    const userObj = {
      id: userData.id,
      email: userData.email,
      role: userData.role,
      full_name: userData.full_name || userData.fullName || userData.email.split('@')[0],
    };
    const authToken = userData.token;

    setUser(userObj);
    setToken(authToken);

    localStorage.setItem('fairway_token', authToken);
    localStorage.setItem('fairway_user', JSON.stringify(userObj));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fairway_token');
    localStorage.removeItem('fairway_user');
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
