import { Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { Template } from "@/data/templates";

interface TemplateThumbCardProps {
  template: Template;
  isSelected: boolean;
  onClick: () => void;
}

export function TemplateThumbCard({ template, isSelected, onClick }: TemplateThumbCardProps) {
  const { styles, isPremium } = template;
  
  // Get background style for image backgrounds
  const getBackgroundStyle = () => {
    if (styles.backgroundType === "image" && styles.backgroundImage) {
      return {
        backgroundImage: `url(${styles.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return {};
  };

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
          isSelected
            ? "border-primary ring-2 ring-primary/20"
            : "border-border hover:border-primary/50",
          styles.backgroundType !== "image" && styles.background
        )}
        style={getBackgroundStyle()}
      >
        {/* Content Container */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-3 gap-2">
          {/* Font Preview "Aa" */}
          <span
            className={cn(
              "text-2xl font-semibold",
              styles.textColor
            )}
            style={{ fontFamily: styles.font }}
          >
            Aa
          </span>
          
          {/* Button Preview */}
          <div
            className={cn(
              "w-3/4 h-5 flex items-center justify-center text-[8px] font-medium",
              styles.buttonStyle,
              styles.buttonBg,
              styles.buttonText
            )}
          >
            Botão
          </div>
        </div>

        {/* Selected Indicator */}
        {isSelected && (
          <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-primary rounded-full flex items-center justify-center shadow-md">
            <Check className="h-3 w-3 text-primary-foreground" />
          </div>
        )}

        {/* Premium Indicator */}
        {isPremium && (
          <div className="absolute top-1.5 left-1.5 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center shadow-md">
            <Zap className="h-3 w-3 text-amber-900" />
          </div>
        )}
      </div>

      {/* Template Name */}
      <span className={cn(
        "mt-1.5 text-xs font-medium transition-colors",
        isSelected ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
      )}>
        {template.name}
      </span>
    </button>
  );
}
