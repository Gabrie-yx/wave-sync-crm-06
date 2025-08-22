/**
 * Módulo de Chat integrado com WhatsApp Web
 * Interface similar ao WhatsApp com QR Code para conexão
 */

import { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  QrCode, 
  Send, 
  Phone, 
  MoreVertical,
  Paperclip,
  Smile,
  Search,
  Users,
  UserPlus,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Interface para contatos do WhatsApp
 */
interface WhatsAppContact {
  id: string;
  name: string;
  phone: string;
  avatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

/**
 * Interface para mensagens
 */
interface WhatsAppMessage {
  id: string;
  contactId: string;
  content: string;
  timestamp: string;
  isFromUser: boolean;
  type: 'text' | 'image' | 'document' | 'transfer';
  status: 'sent' | 'delivered' | 'read';
  transferredTo?: string;
  transferredBy?: string;
}

/**
 * Interface para membros da equipe disponíveis para transferência
 */
interface TeamMember {
  id: string;
  name: string;
  email: string;
  isOnline: boolean;
  department: string;
}

/**
 * Estados de conexão do WhatsApp
 */
type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'qr-required';

/**
 * Componente principal do Chat WhatsApp
 */
export const ChatWhatsApp = () => {
  const { user, isAdmin } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>('disconnected');
  const [contacts, setContacts] = useState<WhatsAppContact[]>([]);
  const [selectedContact, setSelectedContact] = useState<WhatsAppContact | null>(null);
  const [messages, setMessages] = useState<WhatsAppMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTransferDialogOpen, setIsTransferDialogOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  /**
   * Simula carregamento de dados do WhatsApp
   * TODO: Integrar com biblioteca real do WhatsApp Web
   */
  useEffect(() => {
    // Simula dados de contatos
    const sampleContacts: WhatsAppContact[] = [
      {
        id: '1',
        name: 'João Silva',
        phone: '+55 11 99999-9999',
        lastMessage: 'Oi, tenho interesse no produto...',
        lastMessageTime: '10:30',
        unreadCount: 2,
        isOnline: true
      },
      {
        id: '2',
        name: 'Maria Santos',
        phone: '+55 11 88888-8888',
        lastMessage: 'Obrigada pelo atendimento!',
        lastMessageTime: 'Ontem',
        unreadCount: 0,
        isOnline: false
      },
      {
        id: '3',
        name: 'Pedro Costa',
        phone: '+55 11 77777-7777',
        lastMessage: 'Qual o prazo de entrega?',
        lastMessageTime: '14:20',
        unreadCount: 1,
        isOnline: true
      }
    ];

    setContacts(sampleContacts);
  }, []);

  /**
   * Carrega membros da equipe para transferência
   */
  useEffect(() => {
    const mockTeamMembers: TeamMember[] = [
      {
        id: '1',
        name: 'Ana Vendedora',
        email: 'ana@crm.com',
        isOnline: true,
        department: 'Vendas'
      },
      {
        id: '2', 
        name: 'Carlos Suporte',
        email: 'carlos@crm.com',
        isOnline: true,
        department: 'Suporte'
      },
      {
        id: '3',
        name: 'Fernanda Gerente',
        email: 'fernanda@crm.com',
        isOnline: false,
        department: 'Gestão'
      }
    ];
    
    setTeamMembers(mockTeamMembers);
  }, []);

  /**
   * Transfere atendimento para outro membro da equipe
   */
  const handleTransferChat = (memberId: string) => {
    if (!selectedContact) return;
    
    const member = teamMembers.find(m => m.id === memberId);
    if (!member) return;
    
    const transferMessage: WhatsAppMessage = {
      id: Date.now().toString(),
      contactId: selectedContact.id,
      content: `Atendimento transferido para ${member.name} (${member.department})`,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isFromUser: true,
      type: 'transfer',
      status: 'sent',
      transferredTo: member.name,
      transferredBy: user?.name
    };
    
    setMessages(prev => [...prev, transferMessage]);
    setIsTransferDialogOpen(false);
    
    // TODO: Implementar transferência real via API
    // await transferWhatsAppChat(selectedContact.phone, member.id);
  };

  /**
   * Rola para a última mensagem quando novas mensagens são adicionadas
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Simula processo de conexão com WhatsApp
   */
  const handleConnect = async () => {
    setConnectionStatus('connecting');
    
    // Simula tempo de conexão
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simula necessidade de QR Code
    setConnectionStatus('qr-required');
    
    // Simula leitura do QR Code após 5 segundos
    setTimeout(() => {
      setConnectionStatus('connected');
      loadMessagesForContact(contacts[0]?.id);
    }, 5000);
  };

  /**
   * Carrega mensagens para um contato específico
   */
  const loadMessagesForContact = (contactId: string) => {
    // Simula mensagens
    const sampleMessages: WhatsAppMessage[] = [
      {
        id: '1',
        contactId,
        content: 'Olá! Tenho interesse nos seus produtos.',
        timestamp: '10:25',
        isFromUser: false,
        type: 'text',
        status: 'read'
      },
      {
        id: '2',
        contactId,
        content: 'Olá! Ficamos felizes com seu interesse. Como posso ajudá-lo?',
        timestamp: '10:27',
        isFromUser: true,
        type: 'text',
        status: 'read'
      },
      {
        id: '3',
        contactId,
        content: 'Gostaria de saber mais sobre preços e condições.',
        timestamp: '10:30',
        isFromUser: false,
        type: 'text',
        status: 'delivered'
      }
    ];

    setMessages(sampleMessages);
  };

  /**
   * Seleciona um contato e carrega suas mensagens
   */
  const selectContact = (contact: WhatsAppContact) => {
    setSelectedContact(contact);
    loadMessagesForContact(contact.id);
    
    // Marca mensagens como lidas
    setContacts(prev => prev.map(c => 
      c.id === contact.id ? { ...c, unreadCount: 0 } : c
    ));
  };

  /**
   * Envia nova mensagem
   */
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return;

    const message: WhatsAppMessage = {
      id: Date.now().toString(),
      contactId: selectedContact.id,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      isFromUser: true,
      type: 'text',
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // TODO: Integrar com API real do WhatsApp
    // await sendWhatsAppMessage(selectedContact.phone, newMessage);
  };

  /**
   * Filtra contatos baseado na pesquisa
   */
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phone.includes(searchTerm)
  );

  /**
   * Tela de QR Code para conexão
   */
  const QRCodeScreen = () => (
    <div className="flex-1 flex items-center justify-center p-8">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <QrCode className="w-16 h-16 mx-auto mb-4 text-primary" />
          <CardTitle>Conectar WhatsApp Web</CardTitle>
          <CardDescription>
            Escaneie o código QR com seu celular para conectar
          </CardDescription>
        </CardHeader>
        <CardContent>
          {connectionStatus === 'qr-required' ? (
            <div className="space-y-4">
              <div className="w-48 h-48 mx-auto bg-muted border-2 border-dashed border-border rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <QrCode className="w-20 h-20 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">QR Code aqui</p>
                  <div className="mt-2 animate-pulse-slow">
                    <div className="w-32 h-32 mx-auto bg-primary/20 rounded" />
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Aguardando leitura do QR Code...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-48 h-48 mx-auto bg-muted border border-border rounded-lg flex items-center justify-center">
                <div className="text-center">
                  {connectionStatus === 'connecting' ? (
                    <div className="animate-pulse-slow">
                      <MessageSquare className="w-20 h-20 mx-auto text-primary mb-2" />
                      <p className="text-sm text-muted-foreground">Conectando...</p>
                    </div>
                  ) : (
                    <>
                      <QrCode className="w-20 h-20 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">Clique para conectar</p>
                    </>
                  )}
                </div>
              </div>
              {connectionStatus === 'disconnected' && (
                <Button 
                  onClick={handleConnect}
                  className="btn-crm-primary w-full"
                >
                  Conectar WhatsApp
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  /**
   * Interface principal do chat (quando conectado)
   */
  const ChatInterface = () => (
    <div className="flex h-full">
      {/* Lista de Contatos */}
      <div className="w-80 border-r border-border bg-card">
        {/* Header da lista */}
        <div className="p-4 border-b border-border">
          <h2 className="font-semibold text-foreground mb-3">Conversas</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Lista de conversas */}
        <ScrollArea className="h-[calc(100%-100px)]">
          <div className="p-2">
            {filteredContacts.map((contact) => (
              <div
                key={contact.id}
                onClick={() => selectContact(contact)}
                className={`p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent ${
                  selectedContact?.id === contact.id ? 'bg-primary/10 border border-primary/20' : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                    {contact.name.charAt(0).toUpperCase()}
                  </div>

                  {/* Info do contato */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-medium text-foreground truncate">
                        {contact.name}
                      </h4>
                      <span className="text-xs text-muted-foreground">
                        {contact.lastMessageTime}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {contact.lastMessage}
                    </p>
                  </div>

                  {/* Indicadores */}
                  <div className="flex flex-col items-center gap-2">
                    {contact.unreadCount > 0 && (
                      <Badge className="bg-primary text-primary-foreground text-xs">
                        {contact.unreadCount}
                      </Badge>
                    )}
                    {contact.isOnline && (
                      <div className="w-2 h-2 bg-success rounded-full" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Área da conversa */}
      <div className="flex-1 flex flex-col">
        {selectedContact ? (
          <>
            {/* Header da conversa */}
            <div className="p-4 border-b border-border bg-card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-medium">
                  {selectedContact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{selectedContact.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedContact.phone}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {/* Botão de transferência */}
                <Dialog open={isTransferDialogOpen} onOpenChange={setIsTransferDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="sm" title="Transferir atendimento">
                      <Users className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-popover border border-border z-50">
                    <DialogHeader>
                      <DialogTitle className="text-foreground">Transferir Atendimento</DialogTitle>
                      <DialogDescription className="text-muted-foreground">
                        Selecione um membro da equipe para transferir este atendimento
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid gap-3">
                        {teamMembers.map((member) => (
                          <div
                            key={member.id}
                            className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                            onClick={() => handleTransferChat(member.id)}
                          >
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                                  {member.name.split(' ').map(n => n.charAt(0)).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-foreground">{member.name}</p>
                                <p className="text-sm text-muted-foreground">{member.department}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {member.isOnline ? (
                                <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Online
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="bg-muted text-muted-foreground">
                                  <Clock className="w-3 h-3 mr-1" />
                                  Offline
                                </Badge>
                              )}
                              <ArrowRight className="w-4 h-4 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
                
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Mensagens */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isFromUser ? 'justify-end' : 'justify-start'}`}
                  >
                    {message.type === 'transfer' ? (
                      // Mensagem de transferência
                      <div className="w-full max-w-sm mx-auto">
                        <div className="bg-accent border border-border rounded-lg p-3 text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="font-medium text-foreground">Transferência de Atendimento</span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {message.content}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ) : (
                      // Mensagem normal
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isFromUser
                            ? 'chat-bubble-sent'
                            : 'chat-bubble-received'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <div className="flex items-center justify-between mt-1">
                          <p className={`text-xs ${
                            message.isFromUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
                          }`}>
                            {message.timestamp}
                          </p>
                          {message.isFromUser && (
                            <div className="flex items-center gap-1">
                              {message.status === 'sent' && <Clock className="w-3 h-3 text-primary-foreground/50" />}
                              {message.status === 'delivered' && <CheckCircle2 className="w-3 h-3 text-primary-foreground/70" />}
                              {message.status === 'read' && <CheckCircle2 className="w-3 h-3 text-primary-foreground" />}
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input de mensagem */}
            <div className="p-4 border-t border-border bg-card">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Digite uma mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  className="flex-1"
                />
                <Button variant="ghost" size="sm">
                  <Smile className="w-4 h-4" />
                </Button>
                <Button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="btn-crm-primary"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-lg font-medium text-foreground">Selecione uma conversa</p>
              <p className="text-muted-foreground">Escolha um contato para começar a conversar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Chat WhatsApp</h1>
          <p className="text-muted-foreground">
            Integração com WhatsApp Web para atendimento direto
          </p>
        </div>
        
        {connectionStatus === 'connected' && (
          <Badge className="bg-success text-success-foreground">
            Conectado
          </Badge>
        )}
      </div>

      {/* Interface do Chat */}
      <Card className="h-[calc(100vh-200px)]">
        {connectionStatus === 'connected' ? <ChatInterface /> : <QRCodeScreen />}
      </Card>
    </div>
  );
};