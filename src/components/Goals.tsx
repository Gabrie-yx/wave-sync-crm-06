/**
 * 🎯 Sistema de Metas e Objetivos
 * Acompanhamento individual e de equipe com gamificação
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  Trophy, 
  Calendar,
  Plus,
  Edit,
  TrendingUp,
  Users,
  Zap,
  Star,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * 🎯 Tipos de dados para metas
 */
interface Goal {
  id: string;
  title: string;
  description: string;
  type: 'revenue' | 'deals' | 'calls' | 'meetings';
  target: number;
  current: number;
  deadline: string;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'overdue';
  reward?: string;
  teamGoal?: boolean;
}

/**
 * 📊 Dados simulados de metas
 */
const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Meta de Vendas Mensal',
    description: 'Alcançar R$ 50.000 em vendas até o final do mês',
    type: 'revenue',
    target: 50000,
    current: 32500,
    deadline: '2024-08-31',
    priority: 'high',
    status: 'active',
    reward: 'Comissão extra de R$ 2.500'
  },
  {
    id: '2', 
    title: 'Novas Oportunidades',
    description: 'Criar 25 novas oportunidades no funil',
    type: 'deals',
    target: 25,
    current: 18,
    deadline: '2024-08-25',
    priority: 'medium',
    status: 'active'
  },
  {
    id: '3',
    title: 'Ligações Prospectivas',
    description: 'Realizar 100 ligações de prospecção',
    type: 'calls',
    target: 100,
    current: 100,
    deadline: '2024-08-20',
    priority: 'low',
    status: 'completed',
    reward: 'Vale-presente R$ 200'
  },
  {
    id: '4',
    title: 'Meta da Equipe - Q3',
    description: 'Meta coletiva de R$ 200.000 no trimestre',
    type: 'revenue',
    target: 200000,
    current: 156000,
    deadline: '2024-09-30',
    priority: 'high',
    status: 'active',
    teamGoal: true,
    reward: 'Viagem em equipe'
  }
];

/**
 * 🏆 Conquistas e badges
 */
const achievements = [
  { id: '1', title: 'First Sale', icon: '🎯', description: 'Primeira venda realizada', unlocked: true },
  { id: '2', title: 'Deal Closer', icon: '💰', description: '10 vendas fechadas', unlocked: true },
  { id: '3', title: 'Month Champion', icon: '🏆', description: 'Melhor vendedor do mês', unlocked: false },
  { id: '4', title: 'Team Player', icon: '🤝', description: 'Participou de meta em equipe', unlocked: true },
];

/**
 * 🎯 Componente de Metas
 */
export const Goals = () => {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('my-goals');

  /**
   * Calcula a porcentagem de progresso
   */
  const getProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  /**
   * Formata valores baseado no tipo
   */
  const formatValue = (value: number, type: Goal['type']) => {
    switch (type) {
      case 'revenue':
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(value);
      default:
        return value.toString();
    }
  };

  /**
   * Define a cor baseada na prioridade
   */
  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
    }
  };

  /**
   * Define o ícone baseado no status
   */
  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-success" />;
      case 'overdue': return <AlertCircle className="w-4 h-4 text-destructive" />;
      default: return <Clock className="w-4 h-4 text-warning" />;
    }
  };

  /**
   * Renderiza card de meta
   */
  const GoalCard = ({ goal }: { goal: Goal }) => {
    const progress = getProgress(goal.current, goal.target);
    
    return (
      <Card className="card-modern hover-scale">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {goal.teamGoal && <Users className="w-4 h-4 text-primary" />}
                {goal.title}
              </CardTitle>
              <CardDescription className="text-sm">
                {goal.description}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(goal.status)}
              <Badge variant={goal.status === 'completed' ? 'default' : 'secondary'}>
                {goal.status === 'active' ? 'Em Andamento' :
                 goal.status === 'completed' ? 'Concluída' : 'Atrasada'}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Barra de Progresso */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progresso</span>
              <span className="font-medium">
                {formatValue(goal.current, goal.type)} / {formatValue(goal.target, goal.type)}
              </span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span className="font-medium">{Math.round(progress)}%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Prazo: {new Date(goal.deadline).toLocaleDateString('pt-BR')}</span>
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${getPriorityColor(goal.priority)}`}
            >
              {goal.priority === 'high' ? 'Alta' :
               goal.priority === 'medium' ? 'Média' : 'Baixa'} Prioridade
            </Badge>
          </div>

          {/* Recompensa */}
          {goal.reward && (
            <div className="p-3 bg-success-light rounded-lg border border-success/20">
              <div className="flex items-center gap-2 text-sm">
                <Trophy className="w-4 h-4 text-success" />
                <span className="font-medium text-success">Recompensa:</span>
                <span className="text-success">{goal.reward}</span>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Edit className="w-4 h-4" />
              Editar
            </Button>
            {goal.status === 'active' && (
              <Button size="sm" className="flex-1">
                <TrendingUp className="w-4 h-4" />
                Atualizar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container-modern section-padding">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Target className="w-8 h-8 text-primary" />
            Metas & Objetivos
          </h1>
          <p className="text-muted-foreground">
            Acompanhe seu progresso e alcance seus objetivos
          </p>
        </div>
        <Button className="btn-primary">
          <Plus className="w-4 h-4" />
          Nova Meta
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className={`grid w-full ${isAdmin ? 'grid-cols-3' : 'grid-cols-2'}`}>
          <TabsTrigger value="my-goals">Minhas Metas</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
          {isAdmin && <TabsTrigger value="team-goals">Metas da Equipe</TabsTrigger>}
        </TabsList>

        {/* Minhas Metas */}
        <TabsContent value="my-goals" className="space-y-6">
          {/* Resumo Rápido */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-4 flex items-center gap-3">
                <Target className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Metas Ativas</p>
                  <p className="text-xl font-bold text-foreground">3</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-success/10 to-success/5 border-success/20">
              <CardContent className="p-4 flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-success" />
                <div>
                  <p className="text-sm text-muted-foreground">Concluídas</p>
                  <p className="text-xl font-bold text-foreground">1</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-warning/10 to-warning/5 border-warning/20">
              <CardContent className="p-4 flex items-center gap-3">
                <Zap className="w-8 h-8 text-warning" />
                <div>
                  <p className="text-sm text-muted-foreground">Progresso Médio</p>
                  <p className="text-xl font-bold text-foreground">68%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Metas */}
          <div className="grid gap-6">
            {mockGoals.filter(goal => !goal.teamGoal).map(goal => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        </TabsContent>

        {/* Conquistas */}
        <TabsContent value="achievements" className="space-y-6">
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-warning" />
                Suas Conquistas
              </CardTitle>
              <CardDescription>
                Badges e certificações desbloqueadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map(achievement => (
                  <div 
                    key={achievement.id}
                    className={`p-4 rounded-xl border transition-all duration-200 ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:scale-105' 
                        : 'bg-muted/20 border-border opacity-60'
                    }`}
                  >
                    <div className="text-center space-y-2">
                      <div className="text-3xl">{achievement.icon}</div>
                      <h3 className="font-medium text-foreground">{achievement.title}</h3>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      {achievement.unlocked && (
                        <Badge className="text-xs">Desbloqueado</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Metas da Equipe (Admin) */}
        {isAdmin && (
          <TabsContent value="team-goals" className="space-y-6">
            <div className="grid gap-6">
              {mockGoals.filter(goal => goal.teamGoal).map(goal => (
                <GoalCard key={goal.id} goal={goal} />
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};