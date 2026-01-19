import { ComponentType, SVGProps, useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditorProfile, EditorLink } from "@/hooks/useEditorState";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { X, Copy, Check, Pencil } from "lucide-react";
import { toast } from "sonner";

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
  urlTemplate: string;
  isPhone?: boolean;
}

interface ProfileHeaderCardProps {
  profile: EditorProfile;
  socials: EditorLink[];
  platforms: SocialPlatform[];
  onSelectPlatform: (platform: SocialPlatform, existingSocial?: EditorLink) => void;
  onDeleteSocial: (linkId: string) => void;
  onUpdateUsername: (username: string) => void;
}

export function ProfileHeaderCard({ 
  profile, 
  socials, 
  platforms, 
  onSelectPlatform, 
  onDeleteSocial,
  onUpdateUsername 
}: ProfileHeaderCardProps) {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(profile.username || "");
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Sync editValue when profile.username changes
  useEffect(() => {
    setEditValue(profile.username || "");
  }, [profile.username]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  // Create a map of platform id -> existing social link
  const existingSocialsMap = new Map<string, EditorLink>();
  socials.forEach(s => {
    const platform = platforms.find(p => 
      s.icon === p.icon || 
      s.icon?.includes(p.id) ||
      s.title?.toLowerCase() === p.name.toLowerCase()
    );
    if (platform) {
      existingSocialsMap.set(platform.id, s);
    }
  });

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    const link = `https://biobr.site/${profile.username}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveUsername = () => {
    const trimmedValue = editValue.trim();
    if (trimmedValue && trimmedValue !== profile.username) {
      onUpdateUsername(trimmedValue);
      toast.success("Username atualizado!");
    } else {
      setEditValue(profile.username || "");
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveUsername();
    } else if (e.key === 'Escape') {
      setEditValue(profile.username || "");
      setIsEditing(false);
    }
  };

  return (
    <div className="flex flex-col items-center py-8 px-4 bg-card rounded-2xl border border-border mb-6">
      {/* Avatar */}
      <div className="mb-4">
        <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
          <AvatarImage src={profile.avatarUrl || undefined} />
          <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
            {profile.displayName?.charAt(0) || profile.username?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Username Display */}
      <p className="text-muted-foreground text-sm">
        @{profile.username || "usuario"}
      </p>

      {/* Bio Link - Editable */}
      <div className="flex items-center gap-2 mt-3 px-4 py-2 bg-muted/50 rounded-full">
        <span className="text-sm text-muted-foreground">biobr.site/</span>
        
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            onBlur={handleSaveUsername}
            onKeyDown={handleKeyDown}
            className="bg-transparent border-none outline-none text-sm font-medium text-foreground w-28 focus:ring-0"
            maxLength={30}
          />
        ) : (
          <span 
            className="text-sm font-medium text-foreground cursor-pointer hover:underline"
            onClick={() => setIsEditing(true)}
          >
            {profile.username || "usuario"}
          </span>
        )}
        
        {!isEditing && (
          <>
            <button
              onClick={() => setIsEditing(true)}
              className="p-1.5 rounded-full hover:bg-muted transition-colors"
              title="Editar username"
            >
              <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
            <button
              onClick={handleCopyLink}
              className="p-1.5 rounded-full hover:bg-muted transition-colors"
              title="Copiar link"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4 text-muted-foreground" />
              )}
            </button>
          </>
        )}
      </div>

      {/* Social Platform Icons Row */}
      <TooltipProvider delayDuration={100}>
        <div className="flex items-center gap-2 mt-6">
          {platforms.map((platform) => {
            const existingSocial = existingSocialsMap.get(platform.id);
            const isAdded = !!existingSocial;
            const Icon = platform.Icon;
            
            return (
              <Tooltip key={platform.id}>
                <TooltipTrigger asChild>
                  <div className="relative group">
                    {/* Delete button (appears on hover for added socials) */}
                    {isAdded && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSocial(existingSocial.id);
                        }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground 
                                   rounded-full opacity-0 group-hover:opacity-100 transition-opacity
                                   flex items-center justify-center z-10 hover:bg-destructive/90"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                    )}
                    
                    <button
                      onClick={() => onSelectPlatform(platform, existingSocial)}
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center transition-all
                        ${isAdded 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                    </button>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>{isAdded ? `Editar ${platform.name}` : `Adicionar ${platform.name}`}</p>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </TooltipProvider>
    </div>
  );
}
