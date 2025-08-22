/**
 * Componente para alternar entre temas claro/escuro
 */

import { Moon, Sun, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 rounded-lg border border-border bg-background hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="bg-popover border border-border shadow-lg z-50 min-w-[8rem] rounded-lg p-1"
      >
        <DropdownMenuItem 
          onClick={() => setTheme("light")}
          className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Sun className="h-4 w-4" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Moon className="h-4 w-4" />
          <span>Escuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => setTheme("system")}
          className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
        >
          <Monitor className="h-4 w-4" />
          <span>Sistema</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}