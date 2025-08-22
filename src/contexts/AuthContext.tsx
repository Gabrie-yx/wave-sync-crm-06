/**
 * Context de autenticação mock para o CRM
 * Sistema de roles: Admin vs Vendedor
 * Dados persistidos no localStorage
 */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/hooks/use-toast';

export type UserRole = 'admin' | 'vendedor';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  whatsapp?: string;
  rca?: string;
  avatar?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<boolean>;
  isLoading: boolean;
  isAdmin: boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  whatsapp: string;
  rca: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Usuários mock para demonstração
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    name: 'Administrador do Sistema',
    email: 'admin@crm.com',
    password: 'admin123',
    role: 'admin',
    whatsapp: '+55 11 99999-0000',
    rca: 'ADM001',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    name: 'João Vendedor Silva',
    email: 'vendedor@crm.com',
    password: 'vendedor123',
    role: 'vendedor',
    whatsapp: '+55 11 98888-7777',
    rca: 'VEN001',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    createdAt: '2024-01-02'
  }
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se há usuário logado no localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('crm-user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('crm-user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simula delay de autenticação
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const foundUser = MOCK_USERS.find(u => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('crm-user', JSON.stringify(userWithoutPassword));
      
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${userWithoutPassword.name}`,
      });
      
      setIsLoading(false);
      return true;
    } else {
      toast({
        title: "Erro no login",
        description: "Email ou senha incorretos",
        variant: "destructive",
      });
      
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('crm-user');
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do sistema",
    });
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    setIsLoading(true);
    
    // Simula delay de registro
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Verifica se email já existe
    const emailExists = MOCK_USERS.some(u => u.email === userData.email);
    
    if (emailExists) {
      toast({
        title: "Erro no cadastro",
        description: "Este email já está em uso",
        variant: "destructive",
      });
      setIsLoading(false);
      return false;
    }
    
    // Cria novo usuário
    const newUser: User = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      role: 'vendedor', // Novos usuários são sempre vendedores
      whatsapp: userData.whatsapp,
      rca: userData.rca,
      createdAt: new Date().toISOString().split('T')[0]
    };
    
    // Adiciona à lista mock (em produção seria salvo no banco)
    MOCK_USERS.push({ ...newUser, password: userData.password });
    
    setUser(newUser);
    localStorage.setItem('crm-user', JSON.stringify(newUser));
    
    toast({
      title: "Cadastro realizado com sucesso!",
      description: `Bem-vindo ao sistema, ${newUser.name}`,
    });
    
    setIsLoading(false);
    return true;
  };

  const value = {
    user,
    login,
    logout,
    register,
    isLoading,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
};