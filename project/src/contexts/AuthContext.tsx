import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  institution: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  registerAndLogin: () => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    // Simulación de autenticación
    if (email && password) {
      // Obtener datos del registro si existen
      const savedEmail = localStorage.getItem('userEmail');
      const savedNombre = localStorage.getItem('userNombre');
      
      const mockUser: User = {
        id: '1',
        name: savedNombre || 'Prof. María García',
        email: savedEmail || email,
        role: 'Docente',
        institution: 'Universidad San Sebastián'
      };
      setUser(mockUser);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const registerAndLogin = () => {
    // Función para registrar automáticamente después del registro
    const savedEmail = localStorage.getItem('userEmail');
    const savedNombre = localStorage.getItem('userNombre');
    
    if (savedEmail && savedNombre) {
      const newUser: User = {
        id: '1',
        name: savedNombre,
        email: savedEmail,
        role: 'Docente',
        institution: 'Universidad San Sebastián'
      };
      setUser(newUser);
    }
  };

  const value = {
    user,
    login,
    registerAndLogin,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};