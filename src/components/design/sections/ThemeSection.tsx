import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditorProfile } from "@/hooks/useEditorState";
import { templates } from "@/data/templates";

interface ThemeSectionProps {
  profile: EditorProfile;
  onUpdate: (updates: Partial<EditorProfile>) => void;
}

export function ThemeSection({ profile, onUpdate }: ThemeSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Tema</h3>
        <p className="text-sm text-muted-foreground">
          Escolha um tema para sua página
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {templates.map((template) => {
          const isSelected = profile.templateSlug === template.slug;
          
          return (
            <button
              key={template.slug}
              onClick={() => onUpdate({ 
                templateSlug: template.slug,
                // Reset ALL custom settings to use the new template's defaults
                globalBackgroundColor: null,
                globalButtonBgColor: null,
                globalButtonTextColor: null,
                globalButtonStyle: "filled",
                globalButtonBorderRadius: template.styles.buttonStyle,
                // Typography
                titleFont: template.styles.font,
                titleColor: null,
                titleSize: template.styles.textSize,
              })}
              className={cn(
                "relative rounded-xl border-2 p-3 transition-all text-left",
                isSelected
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50"
              )}
            >
              {/* Theme Preview */}
              <div
                className={cn(
                  "aspect-[3/4] rounded-lg mb-2 overflow-hidden",
                  template.styles.background
                )}
              >
                <div className="h-full p-2 flex flex-col items-center justify-center gap-1">
                  {/* Avatar placeholder */}
                  <div className={cn("w-6 h-6 rounded-full", template.styles.cardBg)} />
                  {/* Text placeholder */}
                  <div className={cn("w-12 h-1.5 rounded", template.styles.cardBg)} />
                  <div className={cn("w-8 h-1 rounded opacity-60", template.styles.cardBg)} />
                  {/* Button placeholders */}
                  <div className={cn("w-full h-3 rounded mt-1", template.styles.buttonBg)} />
                  <div className={cn("w-full h-3 rounded", template.styles.buttonBg)} />
                </div>
              </div>

              {/* Theme Name */}
              <p className="font-medium text-sm">{template.name}</p>
              
              {/* Selected Indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <Check className="h-3 w-3 text-primary-foreground" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
