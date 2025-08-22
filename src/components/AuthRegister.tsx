/**
 * Componente de Cadastro do CRM
 * Formulário completo para registro de novos usuários
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, UserPlus, BarChart3, User, Mail, Phone } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Interface para dados do formulário de cadastro
 */
interface RegisterForm {
  fullName: string;
  email: string;
  whatsapp: string;
  rcaNumber: string;
  password: string;
  confirmPassword: string;
}

/**
 * Componente de Cadastro
 */
export const AuthRegister = () => {
  const [formData, setFormData] = useState<RegisterForm>({
    fullName: '',
    email: '',
    whatsapp: '',
    rcaNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { register, isLoading, user } = useAuth();

  // Redireciona se já estiver logado
  if (user) {
    navigate('/dashboard');
    return null;
  }

  /**
   * Atualiza dados do formulário
   */
  const updateFormData = (field: keyof RegisterForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Formata número do WhatsApp
   */
  const formatWhatsApp = (value: string) => {
    // Remove tudo que não for número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica máscara (XX) XXXXX-XXXX
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    
    return numbers.slice(0, 11).replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  /**
   * Valida formulário
   */
  const validateForm = (): boolean => {
    if (!formData.fullName.trim()) {
      toast({
        title: "Nome obrigatório",
        description: "Por favor, informe seu nome completo",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.email.includes('@')) {
      toast({
        title: "Email inválido",
        description: "Por favor, informe um email válido",
        variant: "destructive"
      });
      return false;
    }

    if (formData.whatsapp.replace(/\D/g, '').length < 11) {
      toast({
        title: "WhatsApp inválido",
        description: "Por favor, informe um número de WhatsApp válido",
        variant: "destructive"
      });
      return false;
    }

    if (!formData.rcaNumber.trim()) {
      toast({
        title: "RCA obrigatório",
        description: "Por favor, informe seu número RCA",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Senha muito fraca",
        description: "A senha deve ter pelo menos 6 caracteres",
        variant: "destructive"
      });
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Senhas não conferem",
        description: "As senhas digitadas não são iguais",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  /**
   * Submete o formulário de cadastro usando o AuthContext
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Usa o método register do contexto de autenticação
    const success = await register({
      name: formData.fullName,
      email: formData.email,
      password: formData.password,
      whatsapp: formData.whatsapp,
      rca: formData.rcaNumber
    });

    // Se o registro foi bem-sucedido, redireciona para o dashboard
    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-surface">
      <div className="w-full max-w-lg animate-fade-scale">
        <Card className="card-modern shadow-glass backdrop-glass">
          <CardHeader className="text-center space-y-4">
            {/* Logo do CRM com gradiente */}
            <div className="w-20 h-20 mx-auto bg-gradient-primary rounded-2xl flex items-center justify-center shadow-primary hover-glow">
              <BarChart3 className="w-10 h-10 text-primary-foreground" />
            </div>
            
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold text-foreground text-balance">
                Criar Conta
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Cadastre-se no sistema CRM e comece a vender mais
              </CardDescription>
            </div>
          </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nome Completo */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                Nome Completo *
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Seu nome completo"
                    value={formData.fullName}
                    onChange={(e) => updateFormData('fullName', e.target.value)}
                    className="input-modern focus-visible-ring pl-10"
                    required
                  />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-foreground">
                Email *
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    className="input-modern focus-visible-ring pl-10"
                    required
                  />
              </div>
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-sm font-medium text-foreground">
                WhatsApp *
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="whatsapp"
                    type="tel"
                    placeholder="(11) 99999-9999"
                    value={formData.whatsapp}
                    onChange={(e) => updateFormData('whatsapp', formatWhatsApp(e.target.value))}
                    className="input-modern focus-visible-ring pl-10"
                    required
                  />
              </div>
            </div>

            {/* Número RCA */}
            <div className="space-y-2">
              <Label htmlFor="rcaNumber" className="text-sm font-medium text-foreground">
                Número RCA *
              </Label>
                <Input
                  id="rcaNumber"
                  type="text"
                  placeholder="Seu identificador RCA"
                  value={formData.rcaNumber}
                  onChange={(e) => updateFormData('rcaNumber', e.target.value)}
                  className="input-modern focus-visible-ring"
                  required
                />
            </div>

            {/* Grid de senhas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Senha *
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
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Confirmar Senha */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  Confirmar Senha *
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    className="input-modern focus-visible-ring pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Botão de Cadastro */}
            <Button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full"
            >
              {isLoading ? (
                <div className="animate-pulse-slow">Criando conta...</div>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  Criar Conta
                </>
              )}
            </Button>
          </form>

          {/* Link para login */}
          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Já possui uma conta?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary-hover font-medium transition-colors"
              >
                Faça login aqui
              </Link>
            </p>
          </div>

          {/* Nota sobre integração */}
          <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-border">
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