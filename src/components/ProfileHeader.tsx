import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileHeaderProps {
  displayName: string;
  username: string;
  bio?: string;
  avatarUrl?: string;
}

const ProfileHeader = ({ displayName, username, bio, avatarUrl }: ProfileHeaderProps) => {
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
        <h1 className="font-display text-2xl font-bold text-foreground">{displayName}</h1>
        <p className="text-muted-foreground">@{username}</p>
      </div>
      
      {bio && (
        <p className="max-w-xs text-sm text-muted-foreground leading-relaxed">{bio}</p>
      )}
    </div>
  );
};

export default ProfileHeader;
