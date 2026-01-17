import { Link2, LayoutGrid, Palette, LogOut, ExternalLink, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";

interface AdminSidebarProps {
  activeSection: "links" | "design";
  username?: string;
}

export function AdminSidebar({ activeSection, username }: AdminSidebarProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { isAdmin } = useUserRole();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col h-screen">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-glow">
            <Link2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-lg">Link na Bio</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Button
          variant={activeSection === "links" ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start rounded-xl h-11",
            activeSection === "links" && "bg-secondary"
          )}
          onClick={() => navigate("/admin")}
        >
          <LayoutGrid className="h-5 w-5 mr-3" />
          Links
        </Button>

        <Button
          variant={activeSection === "design" ? "secondary" : "ghost"}
          className={cn(
            "w-full justify-start rounded-xl h-11",
            activeSection === "design" && "bg-secondary"
          )}
          onClick={() => navigate("/design")}
        >
          <Palette className="h-5 w-5 mr-3" />
          Design
        </Button>

        {isAdmin && (
          <Button
            variant="ghost"
            className="w-full justify-start rounded-xl h-11"
            onClick={() => navigate("/admin/users")}
          >
            <Users className="h-5 w-5 mr-3" />
            Usuários
          </Button>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start rounded-xl h-11"
          onClick={() => username && window.open(`/${username}`, "_blank")}
          disabled={!username}
        >
          <ExternalLink className="h-5 w-5 mr-3" />
          Ver minha página
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start rounded-xl h-11 text-muted-foreground hover:text-foreground"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sair
        </Button>
      </div>
    </aside>
  );
}
