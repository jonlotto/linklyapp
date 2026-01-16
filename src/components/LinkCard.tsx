import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkCardProps {
  title: string;
  url: string;
  icon?: string;
  delay?: number;
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonBorderRadius?: string;
}

const LinkCard = ({ 
  title, 
  url, 
  icon, 
  delay = 0,
  buttonBgColor,
  buttonTextColor,
  buttonBorderRadius = "rounded-2xl"
}: LinkCardProps) => {
  const hasCustomColors = buttonBgColor || buttonTextColor;
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full animate-slide-up opacity-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div 
        className={cn(
          "flex items-center justify-between gap-4 px-6 py-4 transition-all duration-300 hover:scale-[1.02]",
          buttonBorderRadius,
          !hasCustomColors && "glass shadow-glow hover:shadow-glow-lg"
        )}
        style={hasCustomColors ? {
          backgroundColor: buttonBgColor || undefined,
          color: buttonTextColor || undefined,
        } : undefined}
      >
        <div className="flex items-center gap-3">
          {icon && <span className="text-xl">{icon}</span>}
          <span className={cn("font-medium", !hasCustomColors && "text-foreground")}>{title}</span>
        </div>
        <ExternalLink className={cn(
          "h-4 w-4 transition-transform duration-300 group-hover:translate-x-1",
          hasCustomColors ? "opacity-60" : "text-muted-foreground group-hover:text-primary"
        )} />
      </div>
    </a>
  );
};

export default LinkCard;
