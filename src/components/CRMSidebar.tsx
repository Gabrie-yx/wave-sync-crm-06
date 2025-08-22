/**
 * 🎯 Sidebar Moderna do CRM
 * Sistema de navegação intuitivo com design aprimorado
 * Suporte completo a temas dark/light e responsividade
 */

import { 
  LayoutDashboard, 
  Users, 
  MessageSquare, 
  Kanban, 
  Settings, 
  Bot,
  BarChart3,
  UserPlus,
  TrendingUp,
  Calendar,
  FileText,
  Target,
  Zap,
  PieChart,
  Trophy,
  Heart
} from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

/**
 * 📊 Seções do Menu organizadas por contexto de trabalho
 */
const menuSections = {
  main: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard,
      description: 'Visão geral e KPIs',
      badge: null,
      color: 'text-primary'
    },
    {
      title: 'Funil de Vendas',
      url: '/kanban',
      icon: Target,
      description: 'Pipeline de oportunidades',
      badge: 'HOT',
      color: 'text-orange-500'
    },
    {
      title: 'Chat WhatsApp',
      url: '/chat',
      icon: MessageSquare,
      description: 'Conversas em tempo real',
      badge: '3',
      color: 'text-green-500'
    }
  ],
  sales: [
    {
      title: 'Relatórios',
      url: '/reports',
      icon: TrendingUp,
      description: 'Performance e analytics',
      badge: null,
      color: 'text-blue-500'
    },
    {
      title: 'Metas',
      url: '/goals',
      icon: Trophy,
      description: 'Acompanhamento de metas',
      badge: null,
      color: 'text-yellow-500'
    },
    {
      title: 'Agenda',
      url: '/calendar',
      icon: Calendar,
      description: 'Compromissos e follow-ups',
      badge: '2',
      color: 'text-purple-500'
    }
  ],
  tools: [
    {
      title: 'Automações',
      url: '/automation',
      icon: Zap,
      description: 'Workflows inteligentes',
      badge: 'PRO',
      color: 'text-indigo-500'
    },
    {
      title: 'Documentos',
      url: '/documents',
      icon: FileText,
      description: 'Propostas e contratos',
      badge: null,
      color: 'text-gray-500'
    }
  ],
  admin: [
    {
      title: 'Equipe',
      url: '/team',
      icon: Users,
      description: 'Gestão de vendedores',
      badge: null,
      color: 'text-red-500',
      adminOnly: true
    },
    {
      title: 'Configurações',
      url: '/settings',
      icon: Settings,
      description: 'Personalização do sistema',
      badge: null,
      color: 'text-gray-600'
    }
  ]
};

/**
 * 🎨 Componente da Sidebar Moderna do CRM
 */
export const CRMSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const { user, isAdmin } = useAuth();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  /**
   * Verifica se a rota atual está ativa
   */
  const isActive = (path: string) => currentPath === path;

  /**
   * Gera classes CSS para o NavLink com base no estado ativo e cor
   */
  const getNavClass = ({ isActive: active }: { isActive: boolean }, item: any) => {
    const baseClass = collapsed 
      ? `
        flex items-center justify-center w-10 h-10 mx-2 my-1 rounded-xl font-medium transition-all duration-200
        text-sm relative overflow-hidden group hover:scale-110
      `
      : `
        flex items-center gap-3 px-3 py-2.5 mx-2 rounded-xl font-medium transition-all duration-200
        text-sm relative overflow-hidden group
      `;
    
    if (active) {
      return `${baseClass} bg-primary text-primary-foreground shadow-sm ${item.color}`;
    }
    
    return `${baseClass} text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground`;
  };

  /**
   * Renderiza um item de menu com badge opcional
   */
  const renderMenuItem = (item: any) => {
    // Verifica se o item é restrito apenas para admin
    if (item.adminOnly && !isAdmin) return null;

    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton asChild className="p-0">
          <NavLink
            to={item.url}
            end
            className={(state) => getNavClass(state, item)}
            title={collapsed ? item.description : undefined}
          >
            <item.icon className={collapsed ? "w-5 h-5" : "w-5 h-5 flex-shrink-0"} />
            
            {!collapsed && (
              <div className="flex-1 flex items-center justify-between min-w-0">
                <div className="flex flex-col min-w-0">
                  <span className="font-medium truncate">{item.title}</span>
                  <span className="text-xs opacity-75 truncate">{item.description}</span>
                </div>
                {item.badge && (
                  <Badge 
                    variant={item.badge === 'PRO' || item.badge === 'HOT' ? 'default' : 'secondary'}
                    className="text-xs px-2 py-0.5 ml-2 flex-shrink-0"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
            )}
            
            {/* Badge pequeno quando colapsado */}
            {collapsed && item.badge && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse"></div>
            )}
          </NavLink>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  /**
   * Renderiza uma seção do menu
   */
  const renderMenuSection = (title: string, items: any[], IconComponent?: any) => (
    <SidebarGroup key={title}>
      <SidebarGroupLabel className="text-sidebar-foreground/70 font-semibold text-xs uppercase tracking-wider px-4 py-2 flex items-center gap-2">
        {!collapsed && (
          <>
            {IconComponent && <IconComponent className="w-3 h-3" />}
            {title}
          </>
        )}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {items.map(renderMenuItem)}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar
      className={`${collapsed ? 'w-16' : 'w-72'} transition-all duration-300 border-r border-sidebar-border bg-sidebar/95 backdrop-blur-sm`}
      collapsible="icon"
    >
      <SidebarContent className={`${collapsed ? 'p-2' : 'p-3'} space-y-${collapsed ? '4' : '6'} scrollbar-thin overflow-y-auto max-h-screen transition-all duration-300`}>
        {/* 🏢 Header/Logo Premium */}
        <div className={`flex items-center ${collapsed ? 'justify-center p-2 mb-1' : 'gap-3 px-3 py-4 mb-2'} transition-all duration-300`}>
          <div className={`${collapsed ? 'w-8 h-8' : 'w-10 h-10'} bg-gradient-primary rounded-xl flex items-center justify-center shadow-primary hover-glow transition-all duration-300`}>
            <BarChart3 className={`${collapsed ? 'w-4 h-4' : 'w-5 h-5'} text-primary-foreground`} />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-bold text-xl text-sidebar-foreground bg-gradient-to-r from-primary to-primary-hover bg-clip-text text-transparent">
                CRM Pro
              </span>
              <span className="text-xs text-sidebar-foreground/60 font-medium">
                Sistema Inteligente
              </span>
            </div>
          )}
        </div>

        {/* 👤 User Info Card - Compacto quando colapsado */}
        {user && (
          <div className={`${collapsed ? 'mx-1 p-1' : 'mx-2 p-3'} bg-sidebar-accent/50 rounded-xl border border-sidebar-border/50 transition-all duration-300`}>
            {collapsed ? (
              <div className="flex justify-center">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {user.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-sidebar-foreground truncate">
                    {user.name}
                  </p>
                  <p className="text-xs text-sidebar-foreground/60 truncate capitalize">
                    {user.role} • {user.rca}
                  </p>
                </div>
                {user.role === 'admin' && (
                  <Badge variant="default" className="text-xs">
                    Admin
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {/* 📋 Seções do Menu */}
        {renderMenuSection('Principal', menuSections.main, LayoutDashboard)}
        {renderMenuSection('Vendas', menuSections.sales, TrendingUp)}
        {renderMenuSection('Ferramentas', menuSections.tools, Zap)}
        {renderMenuSection('Sistema', menuSections.admin, Settings)}

        {/* ❤️ Footer com Status - Só mostra quando expandido */}
        {!collapsed && (
          <div className="mt-auto pt-6 border-t border-sidebar-border/50">
            <div className="flex items-center justify-center gap-2 text-sidebar-foreground/50 text-xs px-3 py-2">
              <Heart className="w-3 h-3 text-red-400 animate-pulse" />
              <span>Feito com carinho</span>
            </div>
          </div>
        )}

        {/* Badge de admin quando colapsado */}
        {collapsed && user?.role === 'admin' && (
          <div className="mt-auto flex justify-center">
            <Badge variant="default" className="text-xs w-fit">
              A
            </Badge>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
};