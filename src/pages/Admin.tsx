import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { templates, Template } from "@/data/templates";
import TemplatePreview from "@/components/TemplatePreview";
import {
  Link2,
  Plus,
  Trash2,
  GripVertical,
  LogOut,
  ExternalLink,
  Save,
  User,
  Shield,
  Crown,
  Users,
  Palette,
  Check,
} from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type Link = Tables<"links">;

const Admin = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const { role, isAdmin, isModerator, loading: roleLoading } = useUserRole();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile form
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  // New link form
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkIcon, setNewLinkIcon] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("starter");

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    if (!user) return;

    try {
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (profileError) throw profileError;

      setProfile(profileData);
      setDisplayName(profileData.display_name || "");
      setUsername(profileData.username || "");
      setBio(profileData.bio || "");
      setSelectedTemplate(profileData.template_slug || "starter");

      // Fetch links
      const { data: linksData, error: linksError } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", user.id)
        .order("position", { ascending: true });

      if (linksError) throw linksError;

      setLinks(linksData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus dados.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: displayName,
          username: username.toLowerCase().replace(/[^a-z0-9]/g, ""),
          bio,
        })
        .eq("user_id", user.id);

      if (error) throw error;

      toast({
        title: "Perfil salvo!",
        description: "Suas alterações foram salvas com sucesso.",
      });

      fetchData();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o perfil.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addLink = async () => {
    if (!user || !newLinkTitle || !newLinkUrl) return;

    try {
      const { error } = await supabase.from("links").insert({
        user_id: user.id,
        title: newLinkTitle,
        url: newLinkUrl.startsWith("http") ? newLinkUrl : `https://${newLinkUrl}`,
        icon: newLinkIcon || null,
        position: links.length,
      });

      if (error) throw error;

      setNewLinkTitle("");
      setNewLinkUrl("");
      setNewLinkIcon("");

      toast({
        title: "Link adicionado!",
        description: "Seu novo link foi adicionado com sucesso.",
      });

      fetchData();
    } catch (error) {
      console.error("Error adding link:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o link.",
        variant: "destructive",
      });
    }
  };

  const updateLinkActive = async (linkId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from("links")
        .update({ is_active: isActive })
        .eq("id", linkId);

      if (error) throw error;

      setLinks(
        links.map((link) =>
          link.id === linkId ? { ...link, is_active: isActive } : link
        )
      );
    } catch (error) {
      console.error("Error updating link:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o link.",
        variant: "destructive",
      });
    }
  };

  const deleteLink = async (linkId: string) => {
    try {
      const { error } = await supabase.from("links").delete().eq("id", linkId);

      if (error) throw error;

      toast({
        title: "Link removido!",
        description: "O link foi removido com sucesso.",
      });

      fetchData();
    } catch (error) {
      console.error("Error deleting link:", error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o link.",
        variant: "destructive",
      });
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  if (authLoading || loading || roleLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="glass-strong rounded-3xl p-8 animate-pulse">
          <div className="h-8 w-48 bg-muted rounded-lg" />
        </div>
      </div>
    );
  }

  const roleIcon = isAdmin ? Crown : isModerator ? Shield : User;
  const roleColor = isAdmin 
    ? "bg-destructive text-destructive-foreground" 
    : isModerator 
    ? "bg-primary text-primary-foreground" 
    : "bg-secondary text-secondary-foreground";

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="glass-strong border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-glow">
              <Link2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display font-bold text-lg">Link na Bio</span>
          </div>

          <div className="flex items-center gap-3">
            <Badge className={`${roleColor} rounded-lg`}>
              {React.createElement(roleIcon, { className: "h-3 w-3 mr-1" })}
              {role}
            </Badge>
            {isAdmin && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/admin/users")}
                className="rounded-xl"
              >
                <Users className="h-4 w-4 mr-2" />
                Usuários
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.open(`/${username}`, "_blank")}
              className="rounded-xl"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Ver página
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSignOut}
              className="rounded-xl"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Welcome Section */}
        <section className="glass-strong rounded-3xl p-6 mb-8 animate-fade-in">
          <h1 className="font-display text-2xl font-bold mb-4">
            Olá, {displayName || username || "usuário"}!
          </h1>
          
          <div className="flex items-center gap-3 mb-6">
            <span className="text-muted-foreground">Template atual:</span>
            <Badge variant="secondary" className="rounded-lg text-sm">
              {templates.find(t => t.slug === selectedTemplate)?.name || "Nenhum"}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/editor?template=${selectedTemplate}`)}
              className="rounded-xl"
            >
              <Palette className="h-4 w-4 mr-2" />
              Editar
            </Button>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => navigate(`/editor?template=${template.slug}`)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all duration-200 hover:scale-[1.02] ${
                  selectedTemplate === template.slug
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-transparent hover:border-border"
                }`}
              >
                <div className="aspect-[9/16]">
                  <TemplatePreview template={template} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <span className="text-white text-xs font-medium">{template.name}</span>
                </div>
                {selectedTemplate === template.slug && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Admin;
