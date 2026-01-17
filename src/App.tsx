import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { RoleGuard } from "@/components/RoleGuard";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminLayout from "./layouts/AdminLayout";
import AdminUsers from "./pages/AdminUsers";
import BioPage from "./pages/BioPage";
import Editor from "./pages/Editor";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin" element={<AdminLayout />} />
            <Route path="/editor" element={<Editor />} />
            <Route path="/design" element={<AdminLayout />} />
            <Route
              path="/admin/users"
              element={
                <RoleGuard allowedRoles={["admin"]}>
                  <AdminUsers />
                </RoleGuard>
              }
            />
            <Route path="/:username" element={<BioPage />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
