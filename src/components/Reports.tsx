/**
 * 📊 Módulo de Relatórios e Analytics
 * Dashboard completo com métricas de vendas e performance
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Users, 
  DollarSign, 
  Target,
  Calendar,
  Download,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

/**
 * 📈 Dados simulados de vendas (em produção viria do backend)
 */
const mockSalesData = {
  overview: {
    totalRevenue: 157420.50,
    totalDeals: 84,
    conversionRate: 24.8,
    averageTicket: 1873.10,
    growth: {
      revenue: 15.2,
      deals: 8.7,
      conversion: -2.1,
      ticket: 12.4
    }
  },
  monthlyTrends: [
    { month: 'Jan', revenue: 12500, deals: 8, conversion: 22.5 },
    { month: 'Fev', revenue: 15200, deals: 12, conversion: 25.1 },
    { month: 'Mar', revenue: 18900, deals: 15, conversion: 28.3 },
    { month: 'Abr', revenue: 22100, deals: 18, conversion: 31.2 },
    { month: 'Mai', revenue: 19800, deals: 14, conversion: 26.8 },
    { month: 'Jun', revenue: 25400, deals: 20, conversion: 32.7 }
  ],
  topPerformers: [
    { name: 'João Silva', revenue: 45200, deals: 28, conversion: 42.1, avatar: 'JS' },
    { name: 'Maria Santos', revenue: 38900, deals: 24, conversion: 38.5, avatar: 'MS' },
    { name: 'Pedro Costa', revenue: 31200, deals: 19, conversion: 35.2, avatar: 'PC' }
  ]
};

/**
 * 🎯 Componente de Relatórios
 */
export const Reports = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Simula atualização de dados
   */
  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  /**
   * Formata valores monetários
   */
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  /**
   * Renderiza card de métrica
   */
  const MetricCard = ({ title, value, icon: Icon, growth, format = 'number' }: any) => (
    <Card className="card-modern hover-scale">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground">
              {format === 'currency' ? formatCurrency(value) : 
               format === 'percentage' ? `${value}%` : value.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-primary/10 rounded-xl">
            <Icon className="w-6 h-6 text-primary" />
          </div>
        </div>
        {growth && (
          <div className="flex items-center gap-2 mt-4">
            {growth > 0 ? (
              <>
                <TrendingUp className="w-4 h-4 text-success" />
                <span className="text-sm font-medium text-success">+{growth}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">{growth}%</span>
              </>
            )}
            <span className="text-sm text-muted-foreground">vs. mês anterior</span>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="container-modern section-padding">
      {/* 📋 Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
          <p className="text-muted-foreground">
            Análise completa de performance e vendas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="btn-secondary">
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            disabled={isLoading}
            className="btn-secondary"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
          <Button size="sm" className="btn-primary">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
        </TabsList>

        {/* 📊 Visão Geral */}
        <TabsContent value="overview" className="space-y-6">
          {/* KPIs Principais */}
          <div className="grid-dashboard">
            <MetricCard
              title="Receita Total"
              value={mockSalesData.overview.totalRevenue}
              icon={DollarSign}
              growth={mockSalesData.overview.growth.revenue}
              format="currency"
            />
            <MetricCard
              title="Vendas Fechadas"
              value={mockSalesData.overview.totalDeals}
              icon={Target}
              growth={mockSalesData.overview.growth.deals}
            />
            <MetricCard
              title="Taxa de Conversão"
              value={mockSalesData.overview.conversionRate}
              icon={TrendingUp}
              growth={mockSalesData.overview.growth.conversion}
              format="percentage"
            />
            <MetricCard
              title="Ticket Médio"
              value={mockSalesData.overview.averageTicket}
              icon={BarChart3}
              growth={mockSalesData.overview.growth.ticket}
              format="currency"
            />
          </div>

          {/* Gráfico de Tendências */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Evolução Mensal
              </CardTitle>
              <CardDescription>
                Performance dos últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center text-muted-foreground">
                <div className="text-center space-y-2">
                  <BarChart3 className="w-12 h-12 mx-auto opacity-50" />
                  <p>Gráfico será implementado com Recharts</p>
                  <p className="text-sm">Integração com dados reais via Supabase</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 🎯 Performance */}
        <TabsContent value="performance" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle>Análise de Performance</CardTitle>
              <CardDescription>
                Métricas detalhadas de conversão e eficiência
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSalesData.monthlyTrends.map((month, index) => (
                  <div key={month.month} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{month.month}</p>
                        <p className="text-sm text-muted-foreground">{month.deals} vendas</p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-bold text-foreground">
                        {formatCurrency(month.revenue)}
                      </p>
                      <Badge variant="secondary" className="text-xs">
                        {month.conversion}% conversão
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 👥 Equipe */}
        <TabsContent value="team" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Top Performers
              </CardTitle>
              <CardDescription>
                Ranking dos melhores vendedores do mês
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSalesData.topPerformers.map((performer, index) => (
                  <div key={performer.name} className="flex items-center justify-between p-4 bg-muted/20 rounded-xl hover:bg-muted/40 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                          {performer.avatar}
                        </div>
                        <Badge className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                          {index + 1}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{performer.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {performer.deals} vendas • {performer.conversion}% conversão
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-primary">
                        {formatCurrency(performer.revenue)}
                      </p>
                      <Badge variant="outline" className="text-xs mt-1">
                        {index === 0 ? '🏆 #1' : index === 1 ? '🥈 #2' : '🥉 #3'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};