import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { EditorProfile, EditorLink } from "@/hooks/useEditorState";

interface ProfileHeaderCardProps {
  profile: EditorProfile;
  socials: EditorLink[];
  onAddSocial: () => void;
  onEditProfile: () => void;
}

export function ProfileHeaderCard({ profile, socials, onAddSocial, onEditProfile }: ProfileHeaderCardProps) {
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

      {/* Social Icons Row */}
      <div className="flex items-center gap-2 mt-4">
        {socials.map((social) => (
          <div
            key={social.id}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-lg"
          >
            {social.icon || "🔗"}
          </div>
        ))}
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full"
          onClick={onAddSocial}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
