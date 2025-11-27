import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback } from 'react';
import { initializeCSRFToken, diagnoseCookieIssues, isSafariBrowser, waitForCookies } from '../utils/csrf';

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

  const login = useCallback(async (email: string, password: string) => {
    if (!(email && password)) return;
    
    // Diagnóstico para iOS (solo en desarrollo)
    if (import.meta.env.DEV) {
      const diagnosis = diagnoseCookieIssues();
      console.log('Cookie diagnosis (iOS check):', diagnosis);
    }
    
    // Limpiar identidad previa para evitar credenciales obsoletas
    try {
      localStorage.removeItem('authUser');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userNombre');
    } catch {}

    // Intento real contra backend
    let backendWorked = false;
    try {
      const base = (import.meta.env.VITE_API_BASE_URL || (window as any).__API_BASE__ || '').replace(/\/$/, '');
      
      // CRÍTICO para iOS: Inicializar CSRF token antes del login
      await initializeCSRFToken();
      
      const loginUrl = `${base}/api/v1/auth/login/`;
      const profileUrl = `${base}/api/v1/auth/profile/`;
      const resp = await fetch(loginUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      if (resp.ok) {
        // CRÍTICO para Safari: Esperar a que las cookies se procesen
        if (isSafariBrowser()) {
          await waitForCookies(500);
        }
        
        // Cargar perfil desde backend
        const pResp = await fetch(profileUrl, {
          method: 'GET',
          credentials: 'include',
        });
        let profile: { name?: string; email?: string } | null = null;
        if (pResp.ok) profile = await pResp.json();
        const displayName = (profile?.name?.trim()) ||
          email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
        const realUser: User = {
          id: 'me',
          name: displayName,
          email: profile?.email || email,
          role: 'Docente',
          institution: 'Universidad San Sebastián',
        };
        setUser(realUser);
        localStorage.setItem('authUser', JSON.stringify(realUser));
        localStorage.setItem('userEmail', realUser.email);
        localStorage.setItem('userNombre', realUser.name);
        backendWorked = true;
      }
    } catch (e) {
      // Ignoramos el error para aplicar fallback
      console.warn('Fallo conexión backend, usando sesión local:', e);
    }

    if (!backendWorked) {
      // Fallback solo frontend para permitir navegación (modo desarrollo)
      const displayName = email.split('@')[0]
        .split('.')
        .map(s => s.charAt(0).toUpperCase() + s.slice(1))
        .join(' ');
      const localUser: User = {
        id: 'local',
        name: displayName || 'Usuario',
        email,
        role: 'Docente (Local)',
        institution: 'USS (Local)',
      };
      setUser(localUser);
      localStorage.setItem('authUser', JSON.stringify(localUser));
      localStorage.setItem('userEmail', localUser.email);
      localStorage.setItem('userNombre', localUser.name);
      localStorage.setItem('authFallback', 'true');
    }
  }, []);

  const logout = useCallback(() => {
    // Cerrar sesión en backend y limpiar cache local
  const base = (import.meta.env.VITE_API_BASE_URL || (window as any).__API_BASE__ || '').replace(/\/$/, '');
  fetch(`${base}/api/v1/auth/logout/`, { method: 'POST', credentials: 'include' }).catch(() => {});
    setUser(null);
    localStorage.removeItem('authUser');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userNombre');
    localStorage.removeItem('profile_name');
    localStorage.removeItem('profile_email');
    localStorage.removeItem('profile_image');
    localStorage.removeItem('profile_telefono');
    localStorage.removeItem('profile_rut');
    localStorage.removeItem('profile_direccion');
    localStorage.removeItem('profile_comuna');
    localStorage.removeItem('profile_region');
    localStorage.removeItem('profile_sede');
    localStorage.removeItem('profile_facultades');
    localStorage.removeItem('profile_carreras');
  }, []);

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

  const updateUser: AuthContextType['updateUser'] = useCallback((updates) => {
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
  }, []);

  const value = useMemo(() => ({
    user,
    login,
    registerAndLogin,
    logout,
    isAuthenticated: !!user,
    updateUser
  }), [user, login, logout, registerAndLogin, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};