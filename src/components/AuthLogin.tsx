/**
 * Componente de Login do CRM
 * Tela de autenticação com email e senha
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Interface para dados do formulário de login
 */
interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

/**
 * Componente de Login
 */
export const AuthLogin = () => {
  const [formData, setFormData] = useState<LoginForm>({
    email: '',
    password: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Hook do contexto de autenticação
  const { login, isLoading, user } = useAuth();

  // Redireciona se já estiver logado
  if (user) {
    navigate('/dashboard');
    return null;
  }

  /**
   * Atualiza dados do formulário
   */
  const updateFormData = (field: keyof LoginForm, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Submete o formulário de login usando o contexto de autenticação
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas antes de tentar o login
    if (!formData.email || !formData.password) {
      toast({
        title: "Erro de validação",
        description: "Email e senha são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    // Usa o método login do contexto de autenticação
    const success = await login(formData.email, formData.password);
    
    // Se o login foi bem-sucedido, redireciona para o dashboard
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-surface">
      <div className="w-full max-w-md animate-fade-scale">
        <Card className="card-modern shadow-glass backdrop-glass">
          <CardHeader className="text-center space-y-4">
            {/* Logo do CRM com gradiente */}
            <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center shadow-primary hover-glow">
              <BarChart3 className="w-10 h-10 text-primary-foreground" />
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-foreground text-balance">
                Entrar no CRM
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Digite suas credenciais para acessar o sistema
              </CardDescription>
            </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                className="input-modern focus-visible-ring"
                required
              />
            </div>

            {/* Senha */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => updateFormData('password', e.target.value)}
                  className="input-modern focus-visible-ring pr-12"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn-icon absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Lembrar-me e Esqueci senha */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) => 
                    updateFormData('rememberMe', checked as boolean)
                  }
                />
                <Label 
                  htmlFor="remember" 
                  className="text-sm text-muted-foreground cursor-pointer"
                >
                  Lembrar-me
                </Label>
              </div>

              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:text-primary-hover transition-colors"
              >
                Esqueci minha senha
              </Link>
            </div>

            {/* Botão de Login */}
            <Button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <div className="animate-pulse-slow">Entrando...</div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Entrar
                </>
              )}
            </Button>
          </form>

          {/* Link para cadastro */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Não possui uma conta?{' '}
              <Link
                to="/register"
                className="text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Cadastre-se aqui
              </Link>
            </p>
          </div>

          {/* Credenciais de teste */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs font-medium text-muted-foreground mb-2">🔑 Credenciais de teste:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div>
                <strong>Admin:</strong> admin@crm.com / admin123
              </div>
              <div>
                <strong>Vendedor:</strong> vendedor@crm.com / vendedor123
              </div>
            </div>
          </div>

          {/* Nota sobre integração */}
          <div className="mt-2 p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground text-center">
              💡 Sistema preparado para integração com Supabase Auth
            </p>
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
};