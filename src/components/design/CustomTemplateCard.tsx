import { Check, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface CustomTemplateCardProps {
  isSelected: boolean;
  onClick: () => void;
}

export function CustomTemplateCard({ isSelected, onClick }: CustomTemplateCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center transition-all duration-200",
        "group"
      )}
    >
      {/* Card Preview */}
      <div
        className={cn(
          "relative w-full aspect-square rounded-xl overflow-hidden border-2 transition-all duration-200",
          "bg-gradient-to-br from-violet-100 via-pink-50 to-cyan-100",
          isSelected
            ? "border-primary ring-2 ring-primary/20"
            : "border-dashed border-muted-foreground/30 hover:border-primary/50"
        )}
      >
        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 gap-2">
          {/* Palette Icon */}
          <div className="w-10 h-10 rounded-full bg-white/80 flex items-center justify-center shadow-sm">
            <Palette className="w-5 h-5 text-violet-600" />
          </div>
          
          {/* Text */}
          <span className="text-[10px] font-medium text-gray-600">
            Personalizar
          </span>
        </div>

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-md">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Template Name */}
      <span className={cn(
        "mt-1.5 text-xs font-medium transition-colors",
        isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
      )}>
        Custom
      </span>
    </button>
  );
}
