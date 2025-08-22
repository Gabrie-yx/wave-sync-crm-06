/**
 * 📄 Sistema de Documentos e Propostas
 * Gestão completa de contratos, propostas e documentos comerciais
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText,
  Download,
  Eye,
  Edit,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  DollarSign,
  CheckCircle,
  Clock,
  AlertTriangle,
  File,
  FileImage,
  FileSpreadsheet
} from 'lucide-react';

/**
 * 📄 Tipos de documentos
 */
interface Document {
  id: string;
  name: string;
  type: 'proposal' | 'contract' | 'quote' | 'presentation' | 'other';
  status: 'draft' | 'sent' | 'viewed' | 'signed' | 'expired';
  client: string;
  deal?: string;
  value?: number;
  createdAt: string;
  updatedAt: string;
  expiryDate?: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'pptx';
  size: string;
  createdBy: string;
  tags: string[];
}

/**
 * 📊 Dados simulados de documentos
 */
const mockDocuments: Document[] = [
  {
    id: '1',
    name: 'Proposta Comercial - ABC Corp',
    type: 'proposal',
    status: 'sent',
    client: 'ABC Corp',
    deal: 'Oportunidade #1234',
    value: 85000,
    createdAt: '2024-08-15',
    updatedAt: '2024-08-20',
    expiryDate: '2024-08-30',
    fileType: 'pdf',
    size: '2.4 MB',
    createdBy: 'João Silva',
    tags: ['proposta', 'software', 'abc-corp']
  },
  {
    id: '2',
    name: 'Contrato de Serviços - XYZ Ltd',
    type: 'contract',
    status: 'signed',
    client: 'XYZ Ltd',
    deal: 'Oportunidade #1235',
    value: 120000,
    createdAt: '2024-08-10',
    updatedAt: '2024-08-18',
    fileType: 'pdf',
    size: '1.8 MB',
    createdBy: 'Maria Santos',
    tags: ['contrato', 'servicos', 'xyz-ltd']
  },
  {
    id: '3',
    name: 'Orçamento - DEF Solutions',
    type: 'quote',
    status: 'viewed',
    client: 'DEF Solutions',
    value: 45000,
    createdAt: '2024-08-18',
    updatedAt: '2024-08-21',
    expiryDate: '2024-08-25',
    fileType: 'xlsx',
    size: '456 KB',
    createdBy: 'Pedro Costa',
    tags: ['orcamento', 'def-solutions']
  },
  {
    id: '4',
    name: 'Apresentação do Produto - GHI Inc',
    type: 'presentation',
    status: 'draft',
    client: 'GHI Inc',
    createdAt: '2024-08-22',
    updatedAt: '2024-08-22',
    fileType: 'pptx',
    size: '12.3 MB',
    createdBy: 'João Silva',
    tags: ['apresentacao', 'produto', 'ghi-inc']
  }
];

/**
 * 📄 Componente de Documentos
 */
export const Documents = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  /**
   * Filtra documentos baseado nos critérios
   */
  const getFilteredDocuments = () => {
    return mockDocuments.filter(doc => {
      const matchesType = activeTab === 'all' || doc.type === activeTab;
      const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus;
      const matchesSearch = searchTerm === '' || 
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesType && matchesStatus && matchesSearch;
    });
  };

  /**
   * Define cor baseada no status
   */
  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'viewed': return 'bg-yellow-100 text-yellow-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Define ícone baseado no status
   */
  const getStatusIcon = (status: Document['status']) => {
    switch (status) {
      case 'draft': return <Edit className="w-3 h-3" />;
      case 'sent': return <Clock className="w-3 h-3" />;
      case 'viewed': return <Eye className="w-3 h-3" />;
      case 'signed': return <CheckCircle className="w-3 h-3" />;
      case 'expired': return <AlertTriangle className="w-3 h-3" />;
    }
  };

  const getFileIcon = (fileType: Document['fileType']) => {
    switch (fileType) {
      case 'pdf': return <FileText className="w-5 h-5 text-red-500" />;
      case 'docx': return <FileText className="w-5 h-5 text-blue-500" />;
      case 'xlsx': return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
      case 'pptx': return <FileImage className="w-5 h-5 text-orange-500" />;
      default: return <File className="w-5 h-5 text-gray-500" />;
    }
  };

  /**
   * Traduz status para português
   */
  const translateStatus = (status: Document['status']) => {
    switch (status) {
      case 'draft': return 'Rascunho';
      case 'sent': return 'Enviado';
      case 'viewed': return 'Visualizado';
      case 'signed': return 'Assinado';
      case 'expired': return 'Expirado';
    }
  };

  /**
   * Traduz tipo para português
   */
  const translateType = (type: Document['type']) => {
    switch (type) {
      case 'proposal': return 'Proposta';
      case 'contract': return 'Contrato';
      case 'quote': return 'Orçamento';
      case 'presentation': return 'Apresentação';
      case 'other': return 'Outro';
    }
  };

  /**
   * Renderiza card de documento
   */
  const DocumentCard = ({ document }: { document: Document }) => (
    <Card className="card-modern hover-scale">
      <CardContent className="p-6 space-y-4">
        {/* Header do documento */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {getFileIcon(document.fileType)}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate">
                {document.name}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {document.client}
              </p>
            </div>
          </div>
          <Badge className={getStatusColor(document.status)}>
            <div className="flex items-center gap-1">
              {getStatusIcon(document.status)}
              {translateStatus(document.status)}
            </div>
          </Badge>
        </div>

        {/* Informações do documento */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <FileText className="w-4 h-4" />
              <span>{translateType(document.type)}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>{document.createdBy}</span>
            </div>
          </div>
          <div className="space-y-2">
            {document.value && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <DollarSign className="w-4 h-4" />
                <span>{new Intl.NumberFormat('pt-BR', {
                  style: 'currency',
                  currency: 'BRL'
                }).format(document.value)}</span>
              </div>
            )}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{new Date(document.updatedAt).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>
        </div>

        {/* Detalhes extras */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{document.size}</span>
          {document.expiryDate && (
            <span>Expira: {new Date(document.expiryDate).toLocaleDateString('pt-BR')}</span>
          )}
        </div>

        {/* Tags */}
        {document.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {document.tags.map(tag => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            <Eye className="w-4 h-4" />
            Visualizar
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button size="sm" className="flex-1">
            <Edit className="w-4 h-4" />
            Editar
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const filteredDocuments = getFilteredDocuments();

  return (
    <div className="container-modern section-padding">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <FileText className="w-8 h-8 text-primary" />
            Documentos
          </h1>
          <p className="text-muted-foreground">
            Gerencie propostas, contratos e documentos comerciais
          </p>
        </div>
        <Button className="btn-primary">
          <Plus className="w-4 h-4" />
          Novo Documento
        </Button>
      </div>

      {/* Controles e Filtros */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Buscar documentos, clientes ou tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-modern pl-10"
          />
        </div>
        <select 
          className="px-4 py-2 border border-border rounded-xl bg-background min-w-[150px]"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">Todos os Status</option>
          <option value="draft">Rascunho</option>
          <option value="sent">Enviado</option>
          <option value="viewed">Visualizado</option>
          <option value="signed">Assinado</option>
          <option value="expired">Expirado</option>
        </select>
      </div>

      {/* Tabs por Tipo */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="proposal">Propostas</TabsTrigger>
          <TabsTrigger value="contract">Contratos</TabsTrigger>
          <TabsTrigger value="quote">Orçamentos</TabsTrigger>
          <TabsTrigger value="presentation">Apresentações</TabsTrigger>
          <TabsTrigger value="other">Outros</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab}>
          {/* Estatísticas Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="text-sm text-blue-800">Total</p>
                    <p className="text-xl font-bold text-blue-900">{mockDocuments.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-green-800">Assinados</p>
                    <p className="text-xl font-bold text-green-900">
                      {mockDocuments.filter(d => d.status === 'signed').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-6 h-6 text-yellow-600" />
                  <div>
                    <p className="text-sm text-yellow-800">Pendentes</p>
                    <p className="text-xl font-bold text-yellow-900">
                      {mockDocuments.filter(d => d.status === 'sent' || d.status === 'viewed').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-purple-600" />
                  <div>
                    <p className="text-sm text-purple-800">Valor Total</p>
                    <p className="text-xl font-bold text-purple-900">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                        maximumFractionDigits: 0
                      }).format(mockDocuments.reduce((sum, doc) => sum + (doc.value || 0), 0))}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Documentos */}
          {filteredDocuments.length > 0 ? (
            <div className="grid gap-4">
              {filteredDocuments.map(document => (
                <DocumentCard key={document.id} document={document} />
              ))}
            </div>
          ) : (
            <Card className="card-modern">
              <CardContent className="p-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Nenhum documento encontrado
                </h3>
                <p className="text-muted-foreground mb-6">
                  Não há documentos que correspondam aos filtros selecionados.
                </p>
                <Button className="btn-primary">
                  <Plus className="w-4 h-4" />
                  Criar Primeiro Documento
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};