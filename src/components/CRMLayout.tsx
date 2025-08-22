/**
 * Layout principal do CRM com sidebar expansível e área de conteúdo
 * Gerencia o estado global da aplicação e navegação
 */

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { CRMSidebar } from '@/components/CRMSidebar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';

interface CRMLayoutProps {
  children: React.ReactNode;
}

/**
 * Layout base do sistema CRM
 * @param children - Conteúdo das páginas a serem renderizadas
 */
export const CRMLayout = ({ children }: CRMLayoutProps) => {
  const { user, logout } = useAuth();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <CRMSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-card/80 backdrop-blur-sm flex items-center justify-between px-6 shadow-sm sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="hover:bg-accent hover:text-accent-foreground transition-colors" />
              <h1 className="text-xl font-semibold text-foreground">Sistema CRM</h1>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 bg-popover border z-50" align="end">
                  <div className="flex items-start gap-2 p-2">
                    <div className="flex flex-col space-y-1">
                      <p className="font-medium text-foreground">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                      <p className="text-xs text-primary capitalize">{user?.role}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-6 overflow-auto animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};