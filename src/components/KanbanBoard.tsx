/**
 * Kanban Board para gerenciamento do funil de vendas
 * Drag and drop para movimentar leads entre etapas
 */

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  User, 
  Calendar, 
  DollarSign, 
  Phone, 
  Mail,
  MoreVertical
} from 'lucide-react';

/**
 * Interface para leads/oportunidades no funil
 */
interface Lead {
  id: string;
  name: string;
  company?: string;
  email?: string;
  phone?: string;
  value: number;
  created: string;
  assignedTo: string;
  priority: 'low' | 'medium' | 'high';
  lastContact?: string;
}

/**
 * Interface para colunas do Kanban
 */
interface KanbanColumn {
  id: string;
  title: string;
  leads: Lead[];
  color: string;
  limit?: number;
}

/**
 * Componente principal do Kanban para funil de vendas
 */
export const KanbanBoard = () => {
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Inicializa dados do Kanban (preparado para integração com API)
   */
  useEffect(() => {
    const loadKanbanData = async () => {
      setIsLoading(true);
      
      // Simula carregamento de dados
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Dados simulados - substituir por API real
      const initialColumns: KanbanColumn[] = [
        {
          id: 'novo-lead',
          title: 'Novos Leads',
          color: 'bg-blue-100 border-blue-300',
          leads: [
            {
              id: '1',
              name: 'João Silva',
              company: 'Tech Solutions Ltda',
              email: 'joao@techsolutions.com',
              phone: '(11) 99999-9999',
              value: 5000,
              created: '2024-01-20',
              assignedTo: 'Maria Santos',
              priority: 'high',
              lastContact: '2024-01-20'
            },
            {
              id: '2',
              name: 'Ana Costa',
              email: 'ana.costa@email.com',
              phone: '(11) 88888-8888',
              value: 3500,
              created: '2024-01-19',
              assignedTo: 'Pedro Lima',
              priority: 'medium'
            }
          ]
        },
        {
          id: 'contato-feito',
          title: 'Contato Feito',
          color: 'bg-yellow-100 border-yellow-300',
          leads: [
            {
              id: '3',
              name: 'Carlos Mendes',
              company: 'Indústria ABC',
              email: 'carlos@industriaabc.com',
              phone: '(11) 77777-7777',
              value: 12000,
              created: '2024-01-18',
              assignedTo: 'Ana Oliveira',
              priority: 'high',
              lastContact: '2024-01-19'
            }
          ]
        },
        {
          id: 'proposta-enviada',
          title: 'Proposta Enviada',
          color: 'bg-purple-100 border-purple-300',
          leads: [
            {
              id: '4',
              name: 'Fernanda Rocha',
              company: 'Startup XYZ',
              email: 'fernanda@startupxyz.com',
              value: 8500,
              created: '2024-01-17',
              assignedTo: 'João Silva',
              priority: 'medium',
              lastContact: '2024-01-18'
            }
          ]
        },
        {
          id: 'negociacao',
          title: 'Em Negociação',
          color: 'bg-orange-100 border-orange-300',
          leads: [
            {
              id: '5',
              name: 'Ricardo Santos',
              company: 'Comércio 123',
              email: 'ricardo@comercio123.com',
              phone: '(11) 66666-6666',
              value: 15000,
              created: '2024-01-15',
              assignedTo: 'Maria Santos',
              priority: 'high',
              lastContact: '2024-01-19'
            }
          ]
        },
        {
          id: 'ganhos',
          title: 'Ganhos',
          color: 'bg-green-100 border-green-300',
          leads: [
            {
              id: '6',
              name: 'Empresa Beta',
              company: 'Beta Corporation',
              email: 'contato@beta.com',
              value: 25000,
              created: '2024-01-10',
              assignedTo: 'Pedro Lima',
              priority: 'high',
              lastContact: '2024-01-18'
            }
          ]
        },
        {
          id: 'perdidos',
          title: 'Perdidos',
          color: 'bg-red-100 border-red-300',
          leads: [
            {
              id: '7',
              name: 'Cliente Antigo',
              email: 'antigo@cliente.com',
              value: 4000,
              created: '2024-01-12',
              assignedTo: 'Ana Oliveira',
              priority: 'low',
              lastContact: '2024-01-16'
            }
          ]
        }
      ];

      setColumns(initialColumns);
      setIsLoading(false);
    };

    loadKanbanData();
  }, []);

  /**
   * Manipula o drag and drop entre colunas
   */
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // Verifica se houve um destino válido
    if (!destination) return;

    // Verifica se o item foi movido para uma posição diferente
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Encontra as colunas de origem e destino
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    // Encontra o lead que está sendo movido
    const leadToMove = sourceColumn.leads.find(lead => lead.id === draggableId);
    if (!leadToMove) return;

    // Cria novas colunas com as atualizações
    const newColumns = columns.map(column => {
      if (column.id === source.droppableId) {
        // Remove o lead da coluna de origem
        return {
          ...column,
          leads: column.leads.filter(lead => lead.id !== draggableId)
        };
      } else if (column.id === destination.droppableId) {
        // Adiciona o lead na coluna de destino
        const newLeads = [...column.leads];
        newLeads.splice(destination.index, 0, leadToMove);
        return {
          ...column,
          leads: newLeads
        };
      }
      return column;
    });

    setColumns(newColumns);

    // TODO: Aqui você faria a chamada para API para salvar a mudança
    // updateLeadStatus(leadToMove.id, destination.droppableId);
  };

  /**
   * Retorna a cor da badge baseada na prioridade
   */
  const getPriorityColor = (priority: Lead['priority']) => {
    const colors = {
      high: 'bg-destructive text-destructive-foreground',
      medium: 'bg-warning text-warning-foreground',
      low: 'bg-muted text-muted-foreground'
    };
    return colors[priority];
  };

  /**
   * Componente do card individual do lead
   */
  const LeadCard = ({ lead, index }: { lead: Lead; index: number }) => (
    <Draggable draggableId={lead.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`kanban-card mb-3 ${
            snapshot.isDragging ? 'rotate-3 shadow-lg' : ''
          } transition-transform duration-200`}
        >
          {/* Header do card com nome e prioridade */}
          <div className="flex items-start justify-between mb-2">
            <h4 className="font-semibold text-foreground text-sm">
              {lead.name}
            </h4>
            <Badge className={`${getPriorityColor(lead.priority)} text-xs`}>
              {lead.priority === 'high' ? 'Alta' : lead.priority === 'medium' ? 'Média' : 'Baixa'}
            </Badge>
          </div>

          {/* Informações da empresa */}
          {lead.company && (
            <p className="text-xs text-muted-foreground mb-2">
              {lead.company}
            </p>
          )}

          {/* Valor da oportunidade */}
          <div className="flex items-center gap-1 mb-2">
            <DollarSign className="w-3 h-3 text-success" />
            <span className="text-sm font-medium text-success">
              R$ {lead.value.toLocaleString('pt-BR')}
            </span>
          </div>

          {/* Contatos */}
          <div className="space-y-1 mb-2">
            {lead.phone && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Phone className="w-3 h-3" />
                {lead.phone}
              </div>
            )}
            {lead.email && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Mail className="w-3 h-3" />
                {lead.email}
              </div>
            )}
          </div>

          {/* Footer com vendedor e data */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
            <div className="flex items-center gap-1">
              <User className="w-3 h-3" />
              {lead.assignedTo}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(lead.created).toLocaleDateString('pt-BR')}
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="h-8 bg-muted rounded w-48 animate-pulse-slow" />
          <div className="h-10 bg-muted rounded w-32 animate-pulse-slow" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {Array(6).fill(0).map((_, i) => (
            <div key={i} className="bg-card border border-border rounded-lg p-4 space-y-3">
              <div className="h-6 bg-muted rounded animate-pulse-slow" />
              <div className="space-y-2">
                {Array(2).fill(0).map((_, j) => (
                  <div key={j} className="h-20 bg-muted rounded animate-pulse-slow" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cabeçalho do Kanban */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Funil de Vendas</h1>
          <p className="text-muted-foreground">
            Gerencie seus leads e oportunidades com drag and drop
          </p>
        </div>
        <Button className="btn-crm-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Novo Lead
        </Button>
      </div>

      {/* Board do Kanban */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 min-h-screen">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={`${column.color} rounded-lg p-4 min-h-32 ${
                    snapshot.isDraggingOver ? 'ring-2 ring-primary shadow-lg' : ''
                  } transition-all duration-200`}
                >
                  {/* Header da coluna */}
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-foreground">
                      {column.title}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {column.leads.length}
                    </Badge>
                  </div>

                  {/* Cards dos leads */}
                  <div className="space-y-2">
                    {column.leads.map((lead, index) => (
                      <LeadCard key={lead.id} lead={lead} index={index} />
                    ))}
                    {provided.placeholder}
                  </div>

                  {/* Adicionar novo lead nesta coluna */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full mt-2 border-2 border-dashed border-border hover:border-primary transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Lead
                  </Button>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};