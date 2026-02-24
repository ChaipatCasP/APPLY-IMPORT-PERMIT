import React, { createContext, useContext, useState, useEffect } from 'react';
import { jagotaApi, AuthenResult } from '../services/jagotaApiService';

interface AuthContextType {
  isAuthenticated: boolean;
  authResult: AuthenResult | null;
  username: string | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authResult, setAuthResult] = useState<AuthenResult | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Start with true to check existing auth
  const [error, setError] = useState<string | null>(null);

  // Check for existing auth on app start
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedAuth = localStorage.getItem('jagota_auth');
        const savedUsername = localStorage.getItem('jagota_username');
        
        if (savedAuth && savedUsername) {
          try {
            const authData = JSON.parse(savedAuth);
            
            // Validate that auth data has required properties
            if (authData && authData.FLAG && authData.STAFF_NAME) {
              setAuthResult(authData);
              setUsername(savedUsername);
              setIsAuthenticated(true);
              
              // Set staff code in API service for future requests
              jagotaApi.setStaffCode(savedUsername);
              
              console.log('Session restored for:', authData.STAFF_NAME);
            } else {
              throw new Error('Invalid auth data format');
            }
          } catch (error) {
            // Clear invalid stored data
            console.warn('Invalid session data, clearing...');
            localStorage.removeItem('jagota_auth');
            localStorage.removeItem('jagota_username');
            setIsAuthenticated(false);
            setAuthResult(null);
            setUsername(null);
          }
        }
      } catch (error) {
        console.error('Error checking auth:', error);
      } finally {
        setIsLoading(false); // Always set loading to false when done
      }
    };

    checkAuth();
  }, []);

  const login = async (inputUsername: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await jagotaApi.authenticateUser({
        P_USERNAME: inputUsername,
        P_PASSWORD: password
      });
      
      if (result.FLAG === '1') {
        setAuthResult(result);
        setUsername(inputUsername);
        setIsAuthenticated(true);
        
        // Set staff code in API service for future requests
        jagotaApi.setStaffCode(inputUsername);
        
        // Save to localStorage for persistence
        localStorage.setItem('jagota_auth', JSON.stringify(result));
        localStorage.setItem('jagota_username', inputUsername);
        
        setError(null);
      } else {
        throw new Error('Authentication failed: Invalid credentials');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Authentication failed';
      setError(errorMessage);
      setIsAuthenticated(false);
      setAuthResult(null);
      setUsername(null);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setAuthResult(null);
    setUsername(null);
    setError(null);
    
    // Clear localStorage
    localStorage.removeItem('jagota_auth');
    localStorage.removeItem('jagota_username');
  };

  const clearError = () => {
    setError(null);
  };

  const value: AuthContextType = {
    isAuthenticated,
    authResult,
    username,
    isLoading,
    error,
    login,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};