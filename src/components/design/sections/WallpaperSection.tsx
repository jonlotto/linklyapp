import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EditorProfile } from "@/hooks/useEditorState";

interface WallpaperSectionProps {
  profile: EditorProfile;
  onUpdate: (updates: Partial<EditorProfile>) => void;
}

const PRESET_COLORS = [
  { name: "Coral", value: "#FF7F6B" },
  { name: "Pêssego", value: "#FFBE9D" },
  { name: "Rosa", value: "#FFB5D0" },
  { name: "Lavanda", value: "#D4BBFF" },
  { name: "Azul", value: "#89CFF0" },
  { name: "Menta", value: "#98FB98" },
  { name: "Amarelo", value: "#FFFACD" },
  { name: "Branco", value: "#FFFFFF" },
  { name: "Cinza Claro", value: "#F5F5F5" },
  { name: "Cinza", value: "#E0E0E0" },
  { name: "Cinza Escuro", value: "#424242" },
  { name: "Preto", value: "#1A1A1A" },
];

export function WallpaperSection({ profile, onUpdate }: WallpaperSectionProps) {
  const [customColor, setCustomColor] = useState(profile.globalBackgroundColor || "#FFFFFF");

  const handleColorSelect = (color: string) => {
    setCustomColor(color);
    onUpdate({ globalBackgroundColor: color });
  };

  const handleReset = () => {
    setCustomColor("#FFFFFF");
    onUpdate({ globalBackgroundColor: null });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Fundo</h3>
        <p className="text-sm text-muted-foreground">
          Personalize a cor de fundo da sua página
        </p>
      </div>

      {/* Preset Colors */}
      <div className="space-y-3">
        <Label>Cores predefinidas</Label>
        <div className="grid grid-cols-6 gap-2">
          {PRESET_COLORS.map((color) => {
            const isSelected = profile.globalBackgroundColor === color.value;
            
            return (
              <button
                key={color.value}
                onClick={() => handleColorSelect(color.value)}
                className={cn(
                  "w-full aspect-square rounded-lg border-2 transition-all relative",
                  isSelected ? "border-primary scale-110" : "border-transparent hover:scale-105"
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Check 
                      className={cn(
                        "h-4 w-4",
                        color.value === "#1A1A1A" || color.value === "#424242" 
                          ? "text-white" 
                          : "text-foreground"
                      )} 
                    />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Color Picker */}
      <div className="space-y-3">
        <Label>Cor personalizada</Label>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="color"
              value={customColor}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="w-12 h-12 rounded-lg border border-border cursor-pointer"
            />
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={customColor.toUpperCase()}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                  setCustomColor(value);
                  if (value.length === 7) {
                    onUpdate({ globalBackgroundColor: value });
                  }
                }
              }}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm font-mono"
              placeholder="#FFFFFF"
            />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      {profile.globalBackgroundColor && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="w-full"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Restaurar cor padrão do tema
        </Button>
      )}
    </div>
  );
}
