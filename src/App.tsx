import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CRMLayout } from "./components/CRMLayout";
import { Dashboard } from "./components/Dashboard";
import { KanbanBoard } from "./components/KanbanBoard";
import { ChatWhatsApp } from "./components/ChatWhatsApp";
import { TeamManagement } from "./components/TeamManagement";
import { AutomationRules } from "./components/AutomationRules";
import { Reports } from "./components/Reports";
import { Goals } from "./components/Goals";
import { CalendarView } from "./components/CalendarView";
import { Documents } from "./components/Documents";
import { Settings } from "./components/Settings";
import { AuthLogin } from "./components/AuthLogin";
import { AuthRegister } from "./components/AuthRegister";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="crm-theme">
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              {/* Rotas de Autenticação */}
              <Route path="/login" element={<AuthLogin />} />
              <Route path="/register" element={<AuthRegister />} />
              
              {/* Rotas protegidas do CRM */}
              <Route path="/" element={<ProtectedRoute><CRMLayout><Dashboard /></CRMLayout></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><CRMLayout><Dashboard /></CRMLayout></ProtectedRoute>} />
              <Route path="/kanban" element={<ProtectedRoute><CRMLayout><KanbanBoard /></CRMLayout></ProtectedRoute>} />
              <Route path="/chat" element={<ProtectedRoute><CRMLayout><ChatWhatsApp /></CRMLayout></ProtectedRoute>} />
              <Route path="/reports" element={<ProtectedRoute><CRMLayout><Reports /></CRMLayout></ProtectedRoute>} />
              <Route path="/goals" element={<ProtectedRoute><CRMLayout><Goals /></CRMLayout></ProtectedRoute>} />
              <Route path="/calendar" element={<ProtectedRoute><CRMLayout><CalendarView /></CRMLayout></ProtectedRoute>} />
              <Route path="/automation" element={<ProtectedRoute><CRMLayout><AutomationRules /></CRMLayout></ProtectedRoute>} />
              <Route path="/documents" element={<ProtectedRoute><CRMLayout><Documents /></CRMLayout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><CRMLayout><Settings /></CRMLayout></ProtectedRoute>} />
              <Route path="/team" element={<ProtectedRoute requiredRole="admin"><CRMLayout><TeamManagement /></CRMLayout></ProtectedRoute>} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
