import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ProfileHeaderProps {
  displayName: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
  titleFont?: string;
  titleColor?: string | null;
  titleSize?: "small" | "large";
}

const ProfileHeader = ({ 
  displayName, 
  username, 
  bio, 
  avatarUrl,
  titleFont = "Inter",
  titleColor,
  titleSize = "large"
}: ProfileHeaderProps) => {
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex flex-col items-center gap-4 text-center animate-fade-in">
      <div className="relative">
        <div className="absolute inset-0 gradient-bg rounded-full blur-xl opacity-50 animate-pulse-glow" />
        <Avatar className="relative h-24 w-24 border-4 border-card shadow-glow-lg">
          <AvatarImage src={avatarUrl} alt={displayName} />
          <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-display font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="space-y-1">
        <h1 
          className={cn(
            "font-bold text-foreground",
            titleSize === "small" ? "text-xl" : "text-2xl"
          )}
          style={{ 
            fontFamily: titleFont,
            color: titleColor || undefined 
          }}
        >
          {displayName}
        </h1>
        <p 
          className="text-muted-foreground"
          style={{ fontFamily: titleFont }}
        >
          @{username}
        </p>
      </div>
      
      {bio && (
        <p 
          className="max-w-xs text-sm text-muted-foreground leading-relaxed"
          style={{ fontFamily: titleFont }}
        >
          {bio}
        </p>
      )}
    </div>
  );
};

export default ProfileHeader;
