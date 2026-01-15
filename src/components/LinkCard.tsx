import { ExternalLink } from "lucide-react";

interface LinkCardProps {
  title: string;
  url: string;
  icon?: string;
  delay?: number;
}

const LinkCard = ({ title, url, icon, delay = 0 }: LinkCardProps) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full animate-slide-up opacity-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="glass shadow-glow flex items-center justify-between gap-4 rounded-2xl px-6 py-4 transition-all duration-300 hover:scale-[1.02] hover:shadow-glow-lg">
        <div className="flex items-center gap-3">
          {icon && <span className="text-xl">{icon}</span>}
          <span className="font-medium text-foreground">{title}</span>
        </div>
        <ExternalLink className="h-4 w-4 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary" />
      </div>
    </a>
  );
};

export default LinkCard;
