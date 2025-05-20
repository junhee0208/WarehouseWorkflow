import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '@shared/schema';
import { useAuthService } from '@/services/authService';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'manager' | 'picker' | 'packer';

interface UserWithRole extends Omit<User, 'id'> {
  id?: number;
  name: string;
  role: UserRole;
  permissions: string[];
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserWithRole | null;
  login: (username: string, password: string, role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserWithRole | null>(null);
  const { authenticateUser } = useAuthService();
  const { toast } = useToast();

  const login = (username: string, password: string, role: UserRole) => {
    try {
      const userData = authenticateUser(username, password, role);
      
      if (userData) {
        setUser(userData);
        setIsAuthenticated(true);
        
        // Store auth state in session storage to persist during page refreshes
        sessionStorage.setItem('wms_auth', JSON.stringify({ isAuthenticated: true, user: userData }));
        
        toast({
          title: "Login successful",
          description: `Welcome, ${userData.name}`,
        });
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login error",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('wms_auth');
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  // Check for existing auth session on component mount
  useEffect(() => {
    const storedAuth = sessionStorage.getItem('wms_auth');
    if (storedAuth) {
      try {
        const { isAuthenticated: authState, user: userData } = JSON.parse(storedAuth);
        if (authState && userData) {
          setIsAuthenticated(authState);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error parsing auth data:', error);
        sessionStorage.removeItem('wms_auth');
      }
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
