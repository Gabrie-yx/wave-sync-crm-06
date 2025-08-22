/**
 * ⚙️ Sistema de Configurações Avançadas
 * Personalização completa do CRM com preferências do usuário
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Palette,
  Shield,
  Database,
  Key,
  Globe,
  Camera,
  Save,
  RefreshCw,
  Trash2,
  Download,
  Upload,
  Monitor,
  Moon,
  Sun,
  Smartphone,
  Mail,
  MessageSquare,
  Zap
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useToast } from '@/hooks/use-toast';

/**
 * ⚙️ Interface de configurações do usuário
 */
interface UserSettings {
  // Perfil
  name: string;
  email: string;
  phone: string;
  bio: string;
  avatar: string;
  
  // Notificações
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  weeklyReports: boolean;
  
  // Preferências
  language: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  
  // Privacidade
  profileVisibility: 'public' | 'private' | 'team';
  activityTracking: boolean;
  dataSharing: boolean;
  
  // Sistema
  autoSave: boolean;
  compactMode: boolean;
  animationsEnabled: boolean;
  soundEffects: boolean;
}

/**
 * ⚙️ Componente de Configurações
 */
export const Settings = () => {
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [isLoading, setIsLoading] = useState(false);

  // Estado das configurações (simulado)
  const [settings, setSettings] = useState<UserSettings>({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.whatsapp || '',
    bio: '',
    avatar: user?.avatar || '',
    
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
    weeklyReports: true,
    
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    dateFormat: 'DD/MM/YYYY',
    currency: 'BRL',
    
    profileVisibility: 'team',
    activityTracking: true,
    dataSharing: false,
    
    autoSave: true,
    compactMode: false,
    animationsEnabled: true,
    soundEffects: true
  });

  /**
   * Atualiza configuração específica
   */
  const updateSetting = <K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  /**
   * Salva todas as configurações
   */
  const saveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Simula salvamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Configurações salvas!",
        description: "Suas preferências foram atualizadas com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as configurações. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Reset das configurações
   */
  const resetSettings = () => {
    toast({
      title: "Configurações restauradas",
      description: "Todas as preferências foram restauradas aos valores padrão.",
    });
  };

  /**
   * Exporta configurações
   */
  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'crm-settings.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Configurações exportadas!",
      description: "Arquivo de configurações foi baixado com sucesso.",
    });
  };

  return (
    <div className="container-modern section-padding">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-primary" />
            Configurações
          </h1>
          <p className="text-muted-foreground">
            Personalize sua experiência no CRM
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportSettings}>
            <Download className="w-4 h-4" />
            Exportar
          </Button>
          <Button onClick={saveSettings} disabled={isLoading} className="btn-primary">
            {isLoading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Salvar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="appearance">Aparência</TabsTrigger>
          <TabsTrigger value="privacy">Privacidade</TabsTrigger>
          <TabsTrigger value="advanced">Avançado</TabsTrigger>
        </TabsList>

        {/* 👤 Perfil do Usuário */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Informações Pessoais
              </CardTitle>
              <CardDescription>
                Atualize suas informações de perfil e dados de contato
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <Avatar className="w-24 h-24">
                  <AvatarImage src={settings.avatar} />
                  <AvatarFallback className="text-2xl bg-gradient-primary text-primary-foreground">
                    {settings.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button size="sm" variant="outline">
                    <Camera className="w-4 h-4" />
                    Alterar Foto
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    JPG, PNG ou GIF. Máximo 5MB.
                  </p>
                </div>
              </div>

              <Separator />

              {/* Dados Básicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => updateSetting('name', e.target.value)}
                    className="input-modern"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateSetting('email', e.target.value)}
                    className="input-modern"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">WhatsApp</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => updateSetting('phone', e.target.value)}
                    className="input-modern"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Cargo</Label>
                  <div className="flex items-center gap-2 p-3 bg-muted/30 rounded-xl">
                    <Badge variant={user?.role === 'admin' ? 'default' : 'secondary'}>
                      {user?.role === 'admin' ? 'Administrador' : 'Vendedor'}
                    </Badge>
                    <span className="text-sm text-muted-foreground">RCA: {user?.rca}</span>
                  </div>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Biografia</Label>
                <textarea
                  id="bio"
                  rows={3}
                  placeholder="Fale um pouco sobre você..."
                  value={settings.bio}
                  onChange={(e) => updateSetting('bio', e.target.value)}
                  className="w-full p-3 border border-border rounded-xl bg-background resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 🔔 Notificações */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-primary" />
                Preferências de Notificação
              </CardTitle>
              <CardDescription>
                Configure como e quando você quer receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Notificações por Email
                </h3>
                
                <div className="space-y-3 pl-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Novas oportunidades</p>
                      <p className="text-sm text-muted-foreground">Quando novos leads são atribuídos</p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) => updateSetting('emailNotifications', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Relatórios semanais</p>
                      <p className="text-sm text-muted-foreground">Resumo de performance toda segunda-feira</p>
                    </div>
                    <Switch
                      checked={settings.weeklyReports}
                      onCheckedChange={(checked) => updateSetting('weeklyReports', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Marketing e promoções</p>
                      <p className="text-sm text-muted-foreground">Novidades e ofertas especiais</p>
                    </div>
                    <Switch
                      checked={settings.marketingEmails}
                      onCheckedChange={(checked) => updateSetting('marketingEmails', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Push */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <Smartphone className="w-4 h-4" />
                  Notificações Push
                </h3>
                
                <div className="flex items-center justify-between pl-6">
                  <div>
                    <p className="font-medium">Ativar notificações push</p>
                    <p className="text-sm text-muted-foreground">Receber alertas em tempo real</p>
                  </div>
                  <Switch
                    checked={settings.pushNotifications}
                    onCheckedChange={(checked) => updateSetting('pushNotifications', checked)}
                  />
                </div>
              </div>

              <Separator />

              {/* SMS */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Notificações SMS
                </h3>
                
                <div className="flex items-center justify-between pl-6">
                  <div>
                    <p className="font-medium">SMS importantes</p>
                    <p className="text-sm text-muted-foreground">Apenas para alertas críticos</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) => updateSetting('smsNotifications', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 🎨 Aparência */}
        <TabsContent value="appearance" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-primary" />
                Tema e Aparência
              </CardTitle>
              <CardDescription>
                Personalize a aparência do sistema conforme sua preferência
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Tema */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Tema do Sistema</h3>
                <div className="grid grid-cols-3 gap-4">
                  <button
                    onClick={() => setTheme('light')}
                    className={`p-4 border rounded-xl transition-all ${
                      theme === 'light' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Sun className="w-6 h-6 mx-auto mb-2 text-yellow-500" />
                    <p className="text-sm font-medium">Claro</p>
                  </button>
                  
                  <button
                    onClick={() => setTheme('dark')}
                    className={`p-4 border rounded-xl transition-all ${
                      theme === 'dark' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Moon className="w-6 h-6 mx-auto mb-2 text-blue-400" />
                    <p className="text-sm font-medium">Escuro</p>
                  </button>
                  
                  <button
                    onClick={() => setTheme('system')}
                    className={`p-4 border rounded-xl transition-all ${
                      theme === 'system' 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Monitor className="w-6 h-6 mx-auto mb-2 text-purple-500" />
                    <p className="text-sm font-medium">Sistema</p>
                  </button>
                </div>
              </div>

              <Separator />

              {/* Preferências de Interface */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Preferências de Interface</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Modo compacto</p>
                      <p className="text-sm text-muted-foreground">Reduz espaçamentos para mais conteúdo</p>
                    </div>
                    <Switch
                      checked={settings.compactMode}
                      onCheckedChange={(checked) => updateSetting('compactMode', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Animações</p>
                      <p className="text-sm text-muted-foreground">Efeitos visuais e transições</p>
                    </div>
                    <Switch
                      checked={settings.animationsEnabled}
                      onCheckedChange={(checked) => updateSetting('animationsEnabled', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Efeitos sonoros</p>
                      <p className="text-sm text-muted-foreground">Sons de notificação e feedback</p>
                    </div>
                    <Switch
                      checked={settings.soundEffects}
                      onCheckedChange={(checked) => updateSetting('soundEffects', checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 🔒 Privacidade */}
        <TabsContent value="privacy" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Privacidade e Segurança
              </CardTitle>
              <CardDescription>
                Gerencie suas configurações de privacidade e segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Visibilidade */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Visibilidade do Perfil</h3>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="visibility"
                      value="public"
                      checked={settings.profileVisibility === 'public'}
                      onChange={(e) => updateSetting('profileVisibility', e.target.value as any)}
                      className="text-primary"
                    />
                    <span>Público - Visível para todos</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="visibility"
                      value="team"
                      checked={settings.profileVisibility === 'team'}
                      onChange={(e) => updateSetting('profileVisibility', e.target.value as any)}
                      className="text-primary"
                    />
                    <span>Equipe - Apenas membros da equipe</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="visibility"
                      value="private"
                      checked={settings.profileVisibility === 'private'}
                      onChange={(e) => updateSetting('profileVisibility', e.target.value as any)}
                      className="text-primary"
                    />
                    <span>Privado - Apenas você</span>
                  </label>
                </div>
              </div>

              <Separator />

              {/* Dados e Tracking */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Coleta de Dados</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Rastreamento de atividade</p>
                      <p className="text-sm text-muted-foreground">Melhorar a experiência do usuário</p>
                    </div>
                    <Switch
                      checked={settings.activityTracking}
                      onCheckedChange={(checked) => updateSetting('activityTracking', checked)}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Compartilhamento de dados</p>
                      <p className="text-sm text-muted-foreground">Para análises e melhorias do sistema</p>
                    </div>
                    <Switch
                      checked={settings.dataSharing}
                      onCheckedChange={(checked) => updateSetting('dataSharing', checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              {/* Ações de Segurança */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Ações de Segurança</h3>
                
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <Key className="w-4 h-4" />
                    Alterar Senha
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <RefreshCw className="w-4 h-4" />
                    Revogar Sessões Ativas
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ⚡ Avançado */}
        <TabsContent value="advanced" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Configurações Avançadas
              </CardTitle>
              <CardDescription>
                Opções para usuários experientes e administradores
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sistema */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Sistema</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Salvamento automático</p>
                    <p className="text-sm text-muted-foreground">Salva alterações automaticamente</p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => updateSetting('autoSave', checked)}
                  />
                </div>
              </div>

              <Separator />

              {/* Localização */}
              <div className="space-y-4">
                <h3 className="font-medium text-foreground">Localização e Formato</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Idioma</Label>
                    <select 
                      className="w-full p-2 border border-border rounded-xl bg-background"
                      value={settings.language}
                      onChange={(e) => updateSetting('language', e.target.value)}
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Fuso Horário</Label>
                    <select 
                      className="w-full p-2 border border-border rounded-xl bg-background"
                      value={settings.timezone}
                      onChange={(e) => updateSetting('timezone', e.target.value)}
                    >
                      <option value="America/Sao_Paulo">São Paulo (GMT-3)</option>
                      <option value="America/New_York">New York (GMT-5)</option>
                      <option value="Europe/London">London (GMT+0)</option>
                    </select>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Ações Perigosas */}
              <div className="space-y-4">
                <h3 className="font-medium text-destructive">Zona de Perigo</h3>
                
                <div className="space-y-3">
                  <Button variant="outline" onClick={resetSettings}>
                    <RefreshCw className="w-4 h-4" />
                    Resetar Configurações
                  </Button>
                  
                  <Button variant="outline" onClick={exportSettings}>
                    <Upload className="w-4 h-4" />
                    Importar Configurações
                  </Button>
                  
                  <Button variant="destructive" onClick={logout}>
                    <Trash2 className="w-4 h-4" />
                    Sair de Todas as Sessões
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};