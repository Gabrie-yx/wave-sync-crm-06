/**
 * Módulo de Gestão de Equipe (Apenas para Admin)
 * Cadastro, edição e visualização de performance da equipe
 */

import { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Trophy, 
  Target,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

/**
 * Interface para membros da equipe
 */
interface TeamMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  rcaNumber: string;
  role: 'admin' | 'seller' | 'manager';
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
  performance: {
    totalSales: number;
    monthlyGoal: number;
    leadsConverted: number;
    revenue: number;
  };
}

/**
 * Interface para formulário de membro
 */
interface MemberForm {
  name: string;
  email: string;
  phone: string;
  rcaNumber: string;
  role: 'admin' | 'seller' | 'manager';
  monthlyGoal: number;
}

/**
 * Componente principal de Gestão de Equipe
 */
export const TeamManagement = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<MemberForm>({
    name: '',
    email: '',
    phone: '',
    rcaNumber: '',
    role: 'seller',
    monthlyGoal: 50000
  });
  const { toast } = useToast();

  /**
   * Carrega dados da equipe
   */
  useEffect(() => {
    const loadTeamData = async () => {
      setIsLoading(true);
      
      // Simula carregamento
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Dados simulados - substituir por API real
      const sampleTeam: TeamMember[] = [
        {
          id: '1',
          name: 'Maria Santos',
          email: 'maria.santos@crm.com',
          phone: '(11) 99999-9999',
          rcaNumber: 'RCA001',
          role: 'admin',
          isActive: true,
          createdAt: '2024-01-01',
          lastLogin: '2024-01-20 14:30',
          performance: {
            totalSales: 15,
            monthlyGoal: 20,
            leadsConverted: 45,
            revenue: 87500
          }
        },
        {
          id: '2',
          name: 'João Silva',
          email: 'joao.silva@crm.com',
          phone: '(11) 88888-8888',
          rcaNumber: 'RCA002',
          role: 'seller',
          isActive: true,
          createdAt: '2024-01-05',
          lastLogin: '2024-01-20 16:45',
          performance: {
            totalSales: 12,
            monthlyGoal: 15,
            leadsConverted: 38,
            revenue: 65200
          }
        },
        {
          id: '3',
          name: 'Pedro Costa',
          email: 'pedro.costa@crm.com',
          phone: '(11) 77777-7777',
          rcaNumber: 'RCA003',
          role: 'seller',
          isActive: true,
          createdAt: '2024-01-10',
          lastLogin: '2024-01-20 12:15',
          performance: {
            totalSales: 8,
            monthlyGoal: 12,
            leadsConverted: 22,
            revenue: 42300
          }
        },
        {
          id: '4',
          name: 'Ana Oliveira',
          email: 'ana.oliveira@crm.com',
          phone: '(11) 66666-6666',
          rcaNumber: 'RCA004',
          role: 'manager',
          isActive: false,
          createdAt: '2024-01-15',
          lastLogin: '2024-01-18 09:20',
          performance: {
            totalSales: 5,
            monthlyGoal: 10,
            leadsConverted: 15,
            revenue: 28900
          }
        }
      ];

      setTeamMembers(sampleTeam);
      setIsLoading(false);
    };

    loadTeamData();
  }, []);

  /**
   * Reseta formulário
   */
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      rcaNumber: '',
      role: 'seller',
      monthlyGoal: 50000
    });
    setEditingMember(null);
  };

  /**
   * Abre dialog para novo membro
   */
  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  /**
   * Abre dialog para edição
   */
  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      email: member.email,
      phone: member.phone,
      rcaNumber: member.rcaNumber,
      role: member.role,
      monthlyGoal: member.performance.monthlyGoal
    });
    setIsDialogOpen(true);
  };

  /**
   * Salva membro (novo ou editado)
   */
  const saveMember = () => {
    if (!formData.name.trim() || !formData.email.trim() || !formData.rcaNumber.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const memberData: TeamMember = {
      id: editingMember?.id || Date.now().toString(),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      rcaNumber: formData.rcaNumber,
      role: formData.role,
      isActive: editingMember?.isActive ?? true,
      createdAt: editingMember?.createdAt || new Date().toISOString().split('T')[0],
      lastLogin: editingMember?.lastLogin,
      performance: {
        ...editingMember?.performance || {
          totalSales: 0,
          leadsConverted: 0,
          revenue: 0
        },
        monthlyGoal: formData.monthlyGoal
      }
    };

    if (editingMember) {
      setTeamMembers(prev => prev.map(m => m.id === editingMember.id ? memberData : m));
      toast({
        title: "Membro atualizado!",
        description: "As alterações foram salvas com sucesso"
      });
    } else {
      setTeamMembers(prev => [memberData, ...prev]);
      toast({
        title: "Membro adicionado!",
        description: "Novo membro da equipe cadastrado"
      });
    }

    setIsDialogOpen(false);
    resetForm();

    // TODO: Salvar no backend
    // await saveMemberToAPI(memberData);
  };

  /**
   * Remove membro
   */
  const deleteMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    toast({
      title: "Membro removido",
      description: "O membro foi removido da equipe"
    });

    // TODO: Remover do backend
    // await deleteMemberFromAPI(id);
  };

  /**
   * Retorna cor do badge baseado no role
   */
  const getRoleBadge = (role: TeamMember['role']) => {
    const roleMap = {
      admin: { label: 'Admin', className: 'bg-destructive text-destructive-foreground' },
      manager: { label: 'Gerente', className: 'bg-warning text-warning-foreground' },
      seller: { label: 'Vendedor', className: 'bg-primary text-primary-foreground' }
    };
    return roleMap[role];
  };

  /**
   * Calcula performance em porcentagem
   */
  const getPerformancePercent = (member: TeamMember): number => {
    return Math.round((member.performance.totalSales / member.performance.monthlyGoal) * 100);
  };

  /**
   * Componente do card de membro
   */
  const MemberCard = ({ member }: { member: TeamMember }) => {
    const roleInfo = getRoleBadge(member.role);
    const performancePercent = getPerformancePercent(member);
    
    return (
      <Card className={`card-hover ${member.isActive ? '' : 'opacity-60'}`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    {member.name}
                    <Badge className={roleInfo.className}>
                      {roleInfo.label}
                    </Badge>
                  </div>
                  <p className="text-sm font-normal text-muted-foreground">
                    {member.rcaNumber}
                  </p>
                </div>
              </CardTitle>
            </div>

            <Badge className={member.isActive ? 'bg-success text-success-foreground' : 'bg-muted text-muted-foreground'}>
              {member.isActive ? 'Ativo' : 'Inativo'}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Contato */}
          <div className="space-y-1 text-sm">
            <p className="text-muted-foreground">📧 {member.email}</p>
            {member.phone && (
              <p className="text-muted-foreground">📱 {member.phone}</p>
            )}
          </div>

          {/* Performance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Meta do Mês</span>
              <span className="text-sm font-bold">{performancePercent}%</span>
            </div>
            
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  performancePercent >= 100 ? 'bg-success' : 
                  performancePercent >= 70 ? 'bg-warning' : 'bg-primary'
                }`}
                style={{ width: `${Math.min(performancePercent, 100)}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-bold text-primary">{member.performance.totalSales}</div>
                <div className="text-xs text-muted-foreground">Vendas</div>
              </div>
              <div className="text-center p-2 bg-muted/50 rounded">
                <div className="font-bold text-success">
                  R$ {(member.performance.revenue / 1000).toFixed(0)}k
                </div>
                <div className="text-xs text-muted-foreground">Receita</div>
              </div>
            </div>
          </div>

          {/* Último login */}
          {member.lastLogin && (
            <p className="text-xs text-muted-foreground">
              Último acesso: {member.lastLogin}
            </p>
          )}

          {/* Ações */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditDialog(member)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteMember(member.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded w-48 animate-pulse-slow" />
          <div className="h-10 bg-muted rounded w-32 animate-pulse-slow" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-80 bg-muted rounded-lg animate-pulse-slow" />
          ))}
        </div>
      </div>
    );
  }

  // Estatísticas da equipe
  const teamStats = {
    totalMembers: teamMembers.length,
    activeMembers: teamMembers.filter(m => m.isActive).length,
    totalRevenue: teamMembers.reduce((sum, m) => sum + m.performance.revenue, 0),
    averagePerformance: Math.round(
      teamMembers.reduce((sum, m) => sum + getPerformancePercent(m), 0) / teamMembers.length
    )
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestão de Equipe</h1>
          <p className="text-muted-foreground">
            Gerencie sua equipe de vendas e acompanhe a performance
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} className="btn-crm-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Adicionar Membro
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMember ? 'Editar Membro' : 'Novo Membro da Equipe'}
              </DialogTitle>
              <DialogDescription>
                Cadastre ou edite informações dos membros da equipe
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4">
              {/* Nome e Email */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              {/* Telefone e RCA */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rca">Número RCA</Label>
                  <Input
                    id="rca"
                    value={formData.rcaNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, rcaNumber: e.target.value }))}
                  />
                </div>
              </div>

              {/* Role e Meta */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Função</Label>
                  <Select 
                    value={formData.role} 
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, role: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seller">Vendedor</SelectItem>
                      <SelectItem value="manager">Gerente</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="goal">Meta Mensal (R$)</Label>
                  <Input
                    id="goal"
                    type="number"
                    value={formData.monthlyGoal}
                    onChange={(e) => setFormData(prev => ({ ...prev, monthlyGoal: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={saveMember} className="btn-crm-primary">
                  {editingMember ? 'Atualizar' : 'Adicionar'} Membro
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas da Equipe */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Membros</p>
                <p className="text-2xl font-bold">{teamStats.totalMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Membros Ativos</p>
                <p className="text-2xl font-bold">{teamStats.activeMembers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Performance Média</p>
                <p className="text-2xl font-bold">{teamStats.averagePerformance}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                <Trophy className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Receita Total</p>
                <p className="text-2xl font-bold">
                  R$ {(teamStats.totalRevenue / 1000).toFixed(0)}k
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Membros */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teamMembers.length > 0 ? (
          teamMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhum membro cadastrado
            </h3>
            <p className="text-muted-foreground mb-4">
              Adicione membros à sua equipe para começar a gerenciar vendas
            </p>
            <Button onClick={openNewDialog} className="btn-crm-primary">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Membro
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};