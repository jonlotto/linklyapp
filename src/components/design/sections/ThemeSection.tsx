import { cn } from "@/lib/utils";
import { EditorProfile } from "@/hooks/useEditorState";
import { templates } from "@/data/templates";
import { TemplateThumbCard } from "../TemplateThumbCard";
import { CustomTemplateCard } from "../CustomTemplateCard";

interface ThemeSectionProps {
  profile: EditorProfile;
  onUpdate: (updates: Partial<EditorProfile>) => void;
}

export function ThemeSection({ profile, onUpdate }: ThemeSectionProps) {
  const isCustomSelected = !templates.some(t => t.slug === profile.templateSlug) || 
    profile.templateSlug === "custom";

  const applyTemplate = (template: typeof templates[0]) => {
    onUpdate({
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
    });
  };

  const setCustomMode = () => {
    onUpdate({
      templateSlug: "custom",
    });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">Tema</h3>
        <p className="text-sm text-muted-foreground">
          Escolha um tema para sua página
        </p>
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
        {/* Custom Card - First Item */}
        <CustomTemplateCard
          isSelected={isCustomSelected}
          onClick={setCustomMode}
        />
        
        {/* Template Cards */}
        {templates.map((template) => (
          <TemplateThumbCard
            key={template.slug}
            template={template}
            isSelected={profile.templateSlug === template.slug}
            onClick={() => applyTemplate(template)}
          />
        ))}
      </div>
    </div>
  );
}
