import { Check, Pencil } from "lucide-react";
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
      {/* Card Preview - Same proportion as template cards */}
      <div
        className={cn(
          "relative w-full aspect-[5/6] rounded-2xl overflow-hidden border-2 transition-all duration-200",
          "bg-gray-50",
          isSelected
            ? "border-primary ring-2 ring-primary/20"
            : "border-dashed border-muted-foreground/40 hover:border-primary/50"
        )}
      >
        {/* Content Container */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Pencil Icon */}
          <Pencil className="w-6 h-6 text-muted-foreground" />
        </div>

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-md">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        )}
      </div>

      {/* Template Name */}
      <span className={cn(
        "mt-2 text-xs font-medium transition-colors",
        isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
      )}>
        Custom
      </span>
    </button>
  );
}
