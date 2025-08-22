/**
 * Automações - Sistema hierárquico com permissões
 * Admin: Cria automações globais para toda equipe
 * Usuário: Cria automações pessoais apenas para si
 */

import { useState, useEffect } from 'react';
import { 
  Bot, 
  Plus, 
  Edit, 
  Trash2, 
  MessageSquare, 
  Zap,
  Clock,
  Settings,
  Globe,
  User,
  Shield,
  Users as UsersIcon
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Interface para regras de automação
 */
interface AutomationRule {
  id: string;
  name: string;
  triggers: string[];
  response: string;
  isActive: boolean;
  createdAt: string;
  lastTriggered?: string;
  triggerCount: number;
  delay?: number; // em segundos
  isGlobal: boolean; // true = criada por admin (todos veem), false = pessoal
  createdBy: string; // ID do usuário que criou
  createdByName: string; // Nome do usuário
}

/**
 * Interface para formulário de nova automação
 */
interface AutomationForm {
  name: string;
  triggers: string;
  response: string;
  delay: number;
}

/**
 * Componente principal de Automações
 */
export const AutomationRules = () => {
  const { user, isAdmin } = useAuth();
  const [automations, setAutomations] = useState<AutomationRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAutomation, setEditingAutomation] = useState<AutomationRule | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'global' | 'personal'>('all');
  const [formData, setFormData] = useState<AutomationForm>({
    name: '',
    triggers: '',
    response: '',
    delay: 0
  });
  const { toast } = useToast();

  /**
   * Carrega automações existentes
   */
  useEffect(() => {
    const loadAutomations = async () => {
      setIsLoading(true);
      
      // Simula carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Dados simulados - substituir por API real
      const sampleAutomations: AutomationRule[] = [
        {
          id: '1',
          name: 'Saudação Geral',
          triggers: ['oi', 'olá', 'ola'],
          response: 'Olá! 👋 Bem-vindo ao nosso atendimento. Como posso ajudá-lo hoje?',
          isActive: true,
          createdAt: '2024-01-15',
          lastTriggered: '2024-01-20 14:30',
          triggerCount: 45,
          delay: 2,
          isGlobal: true,
          createdBy: '1',
          createdByName: 'Administrador do Sistema'
        },
        {
          id: '2',
          name: 'Horário Comercial',
          triggers: ['bom dia', 'boa tarde', 'boa noite'],
          response: 'Obrigado pelo contato! Nosso horário de atendimento é de segunda a sexta, das 8h às 18h. Em breve um consultor irá atendê-lo.',
          isActive: true,
          createdAt: '2024-01-15',
          lastTriggered: '2024-01-20 10:15',
          triggerCount: 23,
          delay: 1,
          isGlobal: true,
          createdBy: '1',
          createdByName: 'Administrador do Sistema'
        },
        {
          id: '3',
          name: 'Interesse em Produto',
          triggers: ['tenho interesse', 'gostaria de saber', 'preço', 'valor'],
          response: 'Que ótimo! 🎉 Vou conectar você com um de nossos consultores especialistas para apresentar as melhores opções para você.',
          isActive: true,
          createdAt: '2024-01-16',
          lastTriggered: '2024-01-20 16:45',
          triggerCount: 12,
          delay: 3,
          isGlobal: false,
          createdBy: '2',
          createdByName: 'João Vendedor Silva'
        },
        {
          id: '4',
          name: 'Fora do Horário',
          triggers: ['atendimento', 'alguém aí', 'tem alguém'],
          response: 'No momento estamos fora do horário de atendimento. Deixe sua mensagem que retornaremos assim que possível!',
          isActive: false,
          createdAt: '2024-01-17',
          triggerCount: 5,
          isGlobal: false,
          createdBy: '2',
          createdByName: 'João Vendedor Silva'
        }
      ];

      setAutomations(sampleAutomations);
      setIsLoading(false);
    };

    loadAutomations();
  }, []);

  /**
   * Reseta formulário
   */
  const resetForm = () => {
    setFormData({
      name: '',
      triggers: '',
      response: '',
      delay: 0
    });
    setEditingAutomation(null);
  };

  /**
   * Abre dialog para nova automação
   */
  const openNewDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  /**
   * Abre dialog para edição
   */
  const openEditDialog = (automation: AutomationRule) => {
    setEditingAutomation(automation);
    setFormData({
      name: automation.name,
      triggers: automation.triggers.join(', '),
      response: automation.response,
      delay: automation.delay || 0
    });
    setIsDialogOpen(true);
  };

  /**
   * Salva automação (nova ou editada)
   */
  const saveAutomation = () => {
    if (!formData.name.trim() || !formData.triggers.trim() || !formData.response.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    const triggersArray = formData.triggers
      .split(',')
      .map(t => t.trim().toLowerCase())
      .filter(t => t.length > 0);

    if (triggersArray.length === 0) {
      toast({
        title: "Gatilhos inválidos",
        description: "Adicione pelo menos um gatilho válido",
        variant: "destructive"
      });
      return;
    }

    const automationData: AutomationRule = {
      id: editingAutomation?.id || Date.now().toString(),
      name: formData.name,
      triggers: triggersArray,
      response: formData.response,
      isActive: editingAutomation?.isActive ?? true,
      createdAt: editingAutomation?.createdAt || new Date().toISOString().split('T')[0],
      triggerCount: editingAutomation?.triggerCount || 0,
      delay: formData.delay,
      lastTriggered: editingAutomation?.lastTriggered,
      isGlobal: isAdmin, // Admin cria globais, usuário cria pessoais
      createdBy: user?.id || '',
      createdByName: user?.name || ''
    };

    if (editingAutomation) {
      // Editar existente
      setAutomations(prev => prev.map(a => a.id === editingAutomation.id ? automationData : a));
      toast({
        title: "Automação atualizada!",
        description: "As alterações foram salvas com sucesso"
      });
    } else {
      // Criar nova
      setAutomations(prev => [automationData, ...prev]);
      toast({
        title: "Automação criada!",
        description: "Nova regra de automação adicionada"
      });
    }

    setIsDialogOpen(false);
    resetForm();

    // TODO: Salvar no backend quando integrado
    // await saveAutomationToAPI(automationData);
  };

  /**
   * Alterna estado ativo/inativo da automação
   */
  const toggleAutomation = (id: string, isActive: boolean) => {
    setAutomations(prev => prev.map(a => 
      a.id === id ? { ...a, isActive } : a
    ));

    toast({
      title: isActive ? "Automação ativada" : "Automação desativada",
      description: isActive ? "A automação está agora ativa" : "A automação foi desativada"
    });

    // TODO: Atualizar no backend
    // await updateAutomationStatus(id, isActive);
  };

  /**
   * Remove automação
   */
  const deleteAutomation = (id: string) => {
    setAutomations(prev => prev.filter(a => a.id !== id));
    toast({
      title: "Automação removida",
      description: "A automação foi removida com sucesso"
    });

    // TODO: Remover do backend
    // await deleteAutomationFromAPI(id);
  };

  /**
   * Componente do card de automação
   */
  const AutomationCard = ({ automation }: { automation: AutomationRule }) => (
    <Card className={`card-hover ${automation.isActive ? 'border-primary/20' : 'border-muted'}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              {automation.name}
              <Badge 
                className={`ml-2 ${
                  automation.isActive 
                    ? 'bg-success text-success-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {automation.isActive ? 'Ativa' : 'Inativa'}
              </Badge>
            </CardTitle>
            <CardDescription className="mt-1">
              Disparada {automation.triggerCount} vezes
              {automation.lastTriggered && (
                <> • Última: {automation.lastTriggered}</>
              )}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={automation.isActive}
              onCheckedChange={(checked) => toggleAutomation(automation.id, checked)}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Gatilhos */}
        <div>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            Gatilhos:
          </Label>
          <div className="flex flex-wrap gap-2">
            {automation.triggers.map((trigger, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                "{trigger}"
              </Badge>
            ))}
          </div>
        </div>

        {/* Resposta */}
        <div>
          <Label className="text-sm font-medium text-muted-foreground mb-2 block">
            Resposta:
          </Label>
          <div className="p-3 bg-muted/50 rounded-lg border border-border">
            <p className="text-sm text-foreground">{automation.response}</p>
          </div>
        </div>

        {/* Delay */}
        {automation.delay && automation.delay > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            Delay: {automation.delay} segundo{automation.delay > 1 ? 's' : ''}
          </div>
        )}

        {/* Ações */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="text-xs text-muted-foreground">
            Criado em {new Date(automation.createdAt).toLocaleDateString('pt-BR')}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => openEditDialog(automation)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteAutomation(automation.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded w-48 animate-pulse-slow" />
          <div className="h-10 bg-muted rounded w-32 animate-pulse-slow" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-64 bg-muted rounded-lg animate-pulse-slow" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Automações</h1>
          <p className="text-muted-foreground">
            Configure respostas automáticas para otimizar o atendimento
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openNewDialog} className="btn-crm-primary flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Nova Automação
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingAutomation ? 'Editar Automação' : 'Nova Automação'}
              </DialogTitle>
              <DialogDescription>
                Configure gatilhos e respostas automáticas para WhatsApp
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Automação</Label>
                <Input
                  id="name"
                  placeholder="Ex: Saudação inicial"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              {/* Gatilhos */}
              <div className="space-y-2">
                <Label htmlFor="triggers">Gatilhos (palavras-chave)</Label>
                <Input
                  id="triggers"
                  placeholder="oi, olá, bom dia (separados por vírgula)"
                  value={formData.triggers}
                  onChange={(e) => setFormData(prev => ({ ...prev, triggers: e.target.value }))}
                />
                <p className="text-xs text-muted-foreground">
                  Separe múltiplos gatilhos com vírgula. Não diferencia maiúsculas/minúsculas.
                </p>
              </div>

              {/* Resposta */}
              <div className="space-y-2">
                <Label htmlFor="response">Resposta Automática</Label>
                <Textarea
                  id="response"
                  placeholder="Digite a mensagem que será enviada automaticamente..."
                  value={formData.response}
                  onChange={(e) => setFormData(prev => ({ ...prev, response: e.target.value }))}
                  rows={4}
                />
              </div>

              {/* Delay */}
              <div className="space-y-2">
                <Label htmlFor="delay">Delay (segundos)</Label>
                <Input
                  id="delay"
                  type="number"
                  min="0"
                  max="60"
                  placeholder="0"
                  value={formData.delay}
                  onChange={(e) => setFormData(prev => ({ ...prev, delay: parseInt(e.target.value) || 0 }))}
                />
                <p className="text-xs text-muted-foreground">
                  Tempo de espera antes de enviar a resposta automática
                </p>
              </div>

              {/* Botões */}
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={saveAutomation} className="btn-crm-primary">
                  {editingAutomation ? 'Atualizar' : 'Criar'} Automação
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total de Automações</p>
                <p className="text-2xl font-bold">{automations.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Automações Ativas</p>
                <p className="text-2xl font-bold">
                  {automations.filter(a => a.isActive).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Mensagens Enviadas</p>
                <p className="text-2xl font-bold">
                  {automations.reduce((total, a) => total + a.triggerCount, 0)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Automações */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {automations.length > 0 ? (
          automations.map((automation) => (
            <AutomationCard key={automation.id} automation={automation} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <Bot className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              Nenhuma automação configurada
            </h3>
            <p className="text-muted-foreground mb-4">
              Crie sua primeira automação para responder automaticamente aos clientes
            </p>
            <Button onClick={openNewDialog} className="btn-crm-primary">
              <Plus className="w-4 h-4 mr-2" />
              Criar Primeira Automação
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};