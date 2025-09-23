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
  updateUser: (updates: Partial<Pick<User, 'name' | 'email' | 'role' | 'institution'>>) => void;
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
  // Cargar usuario persistido si existe
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('authUser');
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

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
      // Persistir
      localStorage.setItem('authUser', JSON.stringify(mockUser));
      localStorage.setItem('userEmail', mockUser.email);
      localStorage.setItem('userNombre', mockUser.name);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
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
      localStorage.setItem('authUser', JSON.stringify(newUser));
    }
  };

  const updateUser: AuthContextType['updateUser'] = (updates) => {
    setUser(prev => {
      const next = prev ? { ...prev, ...updates } : {
        id: '1',
        name: updates.name || 'Usuario',
        email: updates.email || 'usuario@uss.cl',
        role: updates.role || 'Docente',
        institution: updates.institution || 'Universidad San Sebastián'
      };
      try {
        localStorage.setItem('authUser', JSON.stringify(next));
      } catch {}
      if (updates.email) localStorage.setItem('userEmail', updates.email);
      if (updates.name) localStorage.setItem('userNombre', updates.name);
      return next;
    });
  };

  const value = {
    user,
    login,
    registerAndLogin,
    logout,
    isAuthenticated: !!user,
    updateUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};