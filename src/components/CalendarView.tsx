/**
 * 📅 Sistema de Agenda e Compromissos
 * Calendário interativo com follow-ups e reuniões
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Clock,
  Plus,
  Video,
  Phone,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';

/**
 * 📅 Tipos de eventos
 */
interface CalendarEvent {
  id: string;
  title: string;
  description: string;
  type: 'meeting' | 'call' | 'follow-up' | 'demo' | 'closing';
  date: string;
  time: string;
  duration: number; // em minutos
  location?: string;
  attendees: string[];
  priority: 'low' | 'medium' | 'high';
  client?: string;
  deal?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

/**
 * 📊 Dados simulados de eventos
 */
const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Reunião de Follow-up - Cliente ABC',
    description: 'Acompanhar andamento da proposta comercial',
    type: 'follow-up',
    date: '2024-08-22',
    time: '09:00',
    duration: 30,
    attendees: ['João Silva', 'Cliente ABC'],
    priority: 'high',
    client: 'ABC Corp',
    deal: 'Oportunidade #1234',
    status: 'scheduled'
  },
  {
    id: '2',
    title: 'Demo do Produto - XYZ Ltd',
    description: 'Apresentação completa das funcionalidades',
    type: 'demo',
    date: '2024-08-22',
    time: '14:00',
    duration: 60,
    location: 'Sala de Reuniões A',
    attendees: ['Maria Santos', 'Pedro Costa', 'Cliente XYZ'],
    priority: 'high',
    client: 'XYZ Ltd',
    deal: 'Oportunidade #1235',
    status: 'scheduled'
  },
  {
    id: '3',
    title: 'Ligação de Prospecção',
    description: 'Primeira abordagem - leads qualificados',
    type: 'call',
    date: '2024-08-23',
    time: '10:30',
    duration: 15,
    attendees: ['João Silva'],
    priority: 'medium',
    status: 'scheduled'
  },
  {
    id: '4',
    title: 'Fechamento - Contrato DEF',
    description: 'Assinatura do contrato e finalização',
    type: 'closing',
    date: '2024-08-23',
    time: '16:00',
    duration: 45,
    location: 'Escritório do Cliente',
    attendees: ['Maria Santos', 'Cliente DEF'],
    priority: 'high',
    client: 'DEF Solutions',
    deal: 'Oportunidade #1236',
    status: 'scheduled'
  }
];

/**
 * 📅 Componente do Calendário
 */
export const CalendarView = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');

  /**
   * Filtra eventos por data selecionada
   */
  const getEventsForDate = (date: string) => {
    return mockEvents.filter(event => 
      event.date === date && 
      (selectedType === 'all' || event.type === selectedType) &&
      (searchTerm === '' || 
       event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       event.client?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  /**
   * Formata tempo para exibição
   */
  const formatTime = (time: string, duration: number) => {
    const [hours, minutes] = time.split(':');
    const endTime = new Date();
    endTime.setHours(parseInt(hours), parseInt(minutes) + duration);
    return `${time} - ${endTime.toTimeString().slice(0, 5)}`;
  };

  /**
   * Define cor baseada no tipo de evento
   */
  const getEventColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'call': return 'bg-green-100 text-green-800 border-green-200';
      case 'follow-up': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'demo': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'closing': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  /**
   * Define ícone baseado no tipo
   */
  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'meeting': return <Users className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'follow-up': return <Clock className="w-4 h-4" />;
      case 'demo': return <Video className="w-4 h-4" />;
      case 'closing': return <MapPin className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  /**
   * Renderiza card de evento
   */
  const EventCard = ({ event }: { event: CalendarEvent }) => (
    <Card className={`hover-scale transition-all duration-200 border-l-4 ${
      event.priority === 'high' ? 'border-l-destructive' :
      event.priority === 'medium' ? 'border-l-warning' : 'border-l-success'
    }`}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <div className="flex items-center gap-2">
              {getEventIcon(event.type)}
              <h3 className="font-medium text-foreground">{event.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>
          <Badge className={getEventColor(event.type)}>
            {event.type === 'meeting' ? 'Reunião' :
             event.type === 'call' ? 'Ligação' :
             event.type === 'follow-up' ? 'Follow-up' :
             event.type === 'demo' ? 'Demo' : 'Fechamento'}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatTime(event.time, event.duration)}</span>
          </div>
          {event.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span>{event.location}</span>
            </div>
          )}
        </div>

        {event.client && (
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="text-muted-foreground">Cliente: </span>
              <span className="font-medium text-foreground">{event.client}</span>
            </div>
            {event.deal && (
              <Badge variant="outline" className="text-xs">
                {event.deal}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            Editar
          </Button>
          <Button size="sm" className="flex-1">
            {event.type === 'call' ? 'Ligar' : 'Iniciar'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const todaysEvents = getEventsForDate(selectedDate);
  const upcomingEvents = mockEvents
    .filter(event => event.date > selectedDate)
    .slice(0, 3);

  return (
    <div className="container-modern section-padding">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Calendar className="w-8 h-8 text-primary" />
            Agenda
          </h1>
          <p className="text-muted-foreground">
            Gerencie seus compromissos e follow-ups
          </p>
        </div>
        <Button className="btn-primary">
          <Plus className="w-4 h-4" />
          Novo Evento
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar - Controles */}
        <div className="space-y-6">
          {/* Seletor de Data */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-lg">Data Selecionada</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="input-modern"
              />
              
              {/* Navegação Rápida */}
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className="flex-1"
                >
                  Hoje
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    setSelectedDate(tomorrow.toISOString().split('T')[0]);
                  }}
                  className="flex-1"
                >
                  Amanhã
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Filtros */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filtros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  placeholder="Buscar eventos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-modern"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Tipo de Evento:</label>
                <select 
                  className="w-full p-2 border border-border rounded-xl bg-background"
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                >
                  <option value="all">Todos</option>
                  <option value="meeting">Reuniões</option>
                  <option value="call">Ligações</option>
                  <option value="follow-up">Follow-ups</option>
                  <option value="demo">Demos</option>
                  <option value="closing">Fechamentos</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Próximos Eventos */}
          <Card className="card-modern">
            <CardHeader>
              <CardTitle className="text-lg">Próximos Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="p-3 bg-muted/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-1">
                      {getEventIcon(event.type)}
                      <span className="font-medium text-sm">{event.title}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Área Principal - Lista de Eventos */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header da Lista */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-foreground">
              Eventos de {new Date(selectedDate).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h2>
            <Badge variant="outline">
              {todaysEvents.length} evento{todaysEvents.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Lista de Eventos */}
          {todaysEvents.length > 0 ? (
            <div className="space-y-4">
              {todaysEvents.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card className="card-modern">
              <CardContent className="p-12 text-center">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhum evento agendado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Você não tem compromissos para esta data.
                </p>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4" />
                  Agendar Evento
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};