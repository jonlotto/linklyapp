import { ComponentType, SVGProps } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EditorProfile, EditorLink } from "@/hooks/useEditorState";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { X } from "lucide-react";

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
  onEditProfile: () => void;
}

export function ProfileHeaderCard({ 
  profile, 
  socials, 
  platforms, 
  onSelectPlatform, 
  onDeleteSocial,
  onEditProfile 
}: ProfileHeaderCardProps) {
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

  return (
    <div className="flex flex-col items-center py-8 px-4 bg-card rounded-2xl border border-border mb-6">
      {/* Avatar */}
      <div 
        className="cursor-pointer hover:opacity-80 transition-opacity mb-4"
        onClick={onEditProfile}
      >
        <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
          <AvatarImage src={profile.avatarUrl || undefined} />
          <AvatarFallback className="text-2xl font-bold bg-primary text-primary-foreground">
            {profile.displayName?.charAt(0) || profile.username?.charAt(0) || "?"}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Username */}
      <p 
        className="text-muted-foreground text-sm cursor-pointer hover:text-foreground transition-colors"
        onClick={onEditProfile}
      >
        @{profile.username || "usuario"}
      </p>

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
