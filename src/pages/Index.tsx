/**
 * Página inicial do Sistema CRM
 * Dashboard de boas-vindas com acesso rápido às funcionalidades
 */

import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Kanban, 
  MessageSquare, 
  Users, 
  Bot,
  BarChart3,
  ArrowRight,
  Star,
  TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * Componente da página inicial com navegação rápida
 */
const Index = () => {
  // Módulos principais do CRM
  const crmModules = [
    {
      title: 'Dashboard',
      description: 'Visão geral das métricas e performance',
      icon: LayoutDashboard,
      href: '/dashboard',
      color: 'bg-primary/10 text-primary',
      stats: '12 métricas'
    },
    {
      title: 'Funil de Vendas',
      description: 'Kanban para gerenciar leads e oportunidades',
      icon: Kanban,
      href: '/kanban',
      color: 'bg-warning/10 text-warning',
      stats: '47 leads ativos'
    },
    {
      title: 'Chat WhatsApp',
      description: 'Integração completa com WhatsApp Web',
      icon: MessageSquare,
      href: '/chat',
      color: 'bg-success/10 text-success',
      stats: '8 conversas'
    },
    {
      title: 'Gestão de Equipe',
      description: 'Administre vendedores e performance',
      icon: Users,
      href: '/team',
      color: 'bg-destructive/10 text-destructive',
      stats: '4 membros'
    },
    {
      title: 'Automações',
      description: 'Respostas automáticas inteligentes',
      icon: Bot,
      href: '/automation',
      color: 'bg-purple-100 text-purple-600',
      stats: '3 regras ativas'
    },
    {
      title: 'Relatórios',
      description: 'Analytics detalhados e insights',
      icon: BarChart3,
      href: '/reports',
      color: 'bg-blue-100 text-blue-600',
      stats: '15 relatórios'
    }
  ];

  // Destaques do sistema
  const highlights = [
    {
      title: 'Sistema Integrado',
      description: 'Todas as funcionalidades em um só lugar'
    },
    {
      title: 'WhatsApp Nativo',
      description: 'Conexão direta com WhatsApp Web'
    },
    {
      title: 'Automação Inteligente',
      description: 'Respostas automáticas baseadas em IA'
    },
    {
      title: 'Relatórios Detalhados',
      description: 'Analytics completos da equipe'
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-primary-hover rounded-2xl flex items-center justify-center mb-6">
          <BarChart3 className="w-10 h-10 text-primary-foreground" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Bem-vindo ao <span className="text-primary">CRM Pro</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sistema completo de gestão de relacionamento com clientes, 
            integração nativa com WhatsApp e automações inteligentes
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Badge className="bg-success text-success-foreground px-4 py-2">
            <Star className="w-4 h-4 mr-2" />
            Sistema Completo
          </Badge>
          <Badge className="bg-primary text-primary-foreground px-4 py-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            Performance Otimizada
          </Badge>
          <Badge className="bg-warning text-warning-foreground px-4 py-2">
            <Bot className="w-4 h-4 mr-2" />
            IA Integrada
          </Badge>
        </div>
      </div>

      {/* Módulos Principais */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Módulos do Sistema
          </h2>
          <p className="text-muted-foreground">
            Acesse rapidamente todas as funcionalidades do CRM
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {crmModules.map((module) => (
            <Link key={module.href} to={module.href}>
              <Card className="card-hover group cursor-pointer h-full">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                      <module.icon className="w-6 h-6" />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                  
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {module.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {module.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {module.stats}
                    </Badge>
                    <span className="text-sm text-primary font-medium">
                      Acessar →
                    </span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Destaques do Sistema */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Por que escolher nosso CRM?
          </h2>
          <p className="text-muted-foreground">
            Funcionalidades que fazem a diferença no seu negócio
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((highlight, index) => (
            <Card key={index} className="text-center p-6">
              <CardContent className="pt-0">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Star className="w-4 h-4 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {highlight.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {highlight.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Actions */}
      <div className="text-center space-y-6 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Pronto para começar?
            </h2>
            <p className="text-muted-foreground mb-6">
              Explore todas as funcionalidades do sistema e potencialize suas vendas
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/dashboard">
                <Button className="btn-crm-primary flex items-center gap-2">
                  <LayoutDashboard className="w-4 h-4" />
                  Ir para Dashboard
                </Button>
              </Link>
              
              <Link to="/kanban">
                <Button variant="outline" className="flex items-center gap-2">
                  <Kanban className="w-4 h-4" />
                  Ver Funil de Vendas
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Nota sobre integrações */}
        <div className="max-w-xl mx-auto p-4 bg-muted/50 rounded-lg border border-border">
          <p className="text-sm text-muted-foreground">
            💡 <strong>Sistema Preparado:</strong> Estrutura pronta para integração com 
            Supabase (autenticação e banco de dados) e biblioteca Node.js para WhatsApp
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
