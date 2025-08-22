/**
 * Dashboard principal do CRM
 * Exibe métricas, gráficos e visão geral para admin e usuários
 */

import { useState, useEffect } from 'react';
import { 
  Users, 
  TrendingUp, 
  Target, 
  DollarSign, 
  Phone, 
  Mail,
  Calendar,
  Activity
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

/**
 * Interface para as métricas do dashboard
 */
interface DashboardMetrics {
  totalLeads: number;
  convertedLeads: number;
  totalRevenue: number;
  activeUsers: number;
  conversionRate: number;
  averageTicket: number;
}

/**
 * Interface para atividades recentes
 */
interface RecentActivity {
  id: string;
  type: 'lead' | 'sale' | 'call' | 'email';
  description: string;
  user: string;
  timestamp: string;
}

/**
 * Componente Dashboard com métricas e atividades
 * Preparado para receber dados reais via props ou API
 */
export const Dashboard = () => {
  // Estados para dados do dashboard (simulados - preparado para integração com API)
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalLeads: 0,
    convertedLeads: 0,
    totalRevenue: 0,
    activeUsers: 0,
    conversionRate: 0,
    averageTicket: 0
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Simula carregamento de dados do dashboard
   * TODO: Substituir por chamada real à API quando integrado
   */
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      
      // Simula delay de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados - substituir por dados reais
      setMetrics({
        totalLeads: 247,
        convertedLeads: 89,
        totalRevenue: 125430,
        activeUsers: 12,
        conversionRate: 36.0,
        averageTicket: 1409
      });

      setRecentActivities([
        {
          id: '1',
          type: 'lead',
          description: 'Novo lead recebido via WhatsApp',
          user: 'João Silva',
          timestamp: 'há 5 minutos'
        },
        {
          id: '2',
          type: 'sale',
          description: 'Venda fechada - R$ 2.500',
          user: 'Maria Santos',
          timestamp: 'há 15 minutos'
        },
        {
          id: '3',
          type: 'call',
          description: 'Ligação realizada para lead quente',
          user: 'Pedro Costa',
          timestamp: 'há 30 minutos'
        },
        {
          id: '4',
          type: 'email',
          description: 'Proposta enviada por email',
          user: 'Ana Oliveira',
          timestamp: 'há 1 hora'
        }
      ]);

      setIsLoading(false);
    };

    loadDashboardData();
  }, []);

  /**
   * Cartões de métricas principais
   */
  const MetricCard = ({ 
    title, 
    value, 
    icon: Icon, 
    change, 
    format = 'number' 
  }: { 
    title: string; 
    value: number; 
    icon: any; 
    change?: number;
    format?: 'number' | 'currency' | 'percentage';
  }) => {
    const formatValue = (val: number) => {
      switch (format) {
        case 'currency':
          return `R$ ${val.toLocaleString('pt-BR')}`;
        case 'percentage':
          return `${val}%`;
        default:
          return val.toLocaleString('pt-BR');
      }
    };

    return (
      <Card className="card-modern hover-scale group">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {title}
          </CardTitle>
          <div className="p-2 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
            {isLoading ? (
              <div className="h-9 bg-muted rounded-lg loading-shimmer" />
            ) : (
              formatValue(value)
            )}
          </div>
          {change !== undefined && (
            <div className="flex items-center gap-1">
              <span className={`text-sm font-medium ${change >= 0 ? 'text-success' : 'text-destructive'}`}>
                {change >= 0 ? '+' : ''}{change}%
              </span>
              <span className="text-xs text-muted-foreground">
                em relação ao mês anterior
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  /**
   * Ícone para tipo de atividade
   */
  const getActivityIcon = (type: RecentActivity['type']) => {
    const iconMap = {
      lead: Users,
      sale: DollarSign,
      call: Phone,
      email: Mail
    };
    const Icon = iconMap[type];
    return <Icon className="w-4 h-4" />;
  };

  return (
    <div className="container-modern section-padding content-spacing">
      {/* Cabeçalho do Dashboard */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 animate-fade-in">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground text-balance">Dashboard</h1>
          <p className="text-lg text-muted-foreground">
            Visão geral das suas métricas de vendas e performance
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50">
          <Calendar className="w-5 h-5 text-primary" />
          <span className="text-sm font-medium text-foreground">
            Atualizado: {new Date().toLocaleString('pt-BR')}
          </span>
        </div>
      </div>

      {/* Grid de Métricas Principais */}
      <div className="grid-dashboard animate-fade-in animation-delay-150">
        <MetricCard
          title="Total de Leads"
          value={metrics.totalLeads}
          icon={Users}
          change={12}
        />
        <MetricCard
          title="Taxa de Conversão"
          value={metrics.conversionRate}
          icon={TrendingUp}
          change={5.2}
          format="percentage"
        />
        <MetricCard
          title="Receita Total"
          value={metrics.totalRevenue}
          icon={DollarSign}
          change={8.7}
          format="currency"
        />
        <MetricCard
          title="Ticket Médio"
          value={metrics.averageTicket}
          icon={Target}
          change={-2.1}
          format="currency"
        />
      </div>

      {/* Grid de Informações Detalhadas */}
      <div className="grid gap-6 md:grid-cols-2 animate-fade-in animation-delay-300">
        {/* Atividades Recentes */}
        <Card className="card-modern hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Atividades Recentes
            </CardTitle>
            <CardDescription>
              Últimas interações da equipe
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                // Loading skeleton
                Array(4).fill(0).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded animate-pulse-slow" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-muted rounded animate-pulse-slow" />
                      <div className="h-3 bg-muted rounded w-1/2 animate-pulse-slow" />
                    </div>
                  </div>
                ))
              ) : (
                recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        {activity.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.user} • {activity.timestamp}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Meta do Mês */}
        <Card className="card-modern hover-scale">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Meta do Mês
            </CardTitle>
            <CardDescription>
              Progresso em relação ao objetivo mensal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Barra de progresso da meta */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Vendas Realizadas</span>
                <span className="font-medium">
                  R$ {metrics.totalRevenue.toLocaleString('pt-BR')} / R$ 200.000
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-primary to-primary-hover h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((metrics.totalRevenue / 200000) * 100, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round((metrics.totalRevenue / 200000) * 100)}% da meta atingida
              </p>
            </div>

            {/* Estatísticas adicionais */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center p-3 bg-success/10 rounded-lg">
                <div className="text-xl font-bold text-success">
                  {metrics.convertedLeads}
                </div>
                <div className="text-xs text-success/70">Vendas Fechadas</div>
              </div>
              <div className="text-center p-3 bg-primary/10 rounded-lg">
                <div className="text-xl font-bold text-primary">
                  {metrics.activeUsers}
                </div>
                <div className="text-xs text-primary/70">Vendedores Ativos</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};