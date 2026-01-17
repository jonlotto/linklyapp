import { useState } from "react";
import { Check, Pencil, RotateCcw } from "lucide-react";
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

  const isCustomColorSelected = profile.globalBackgroundColor && 
    !PRESET_COLORS.some(c => c.value === profile.globalBackgroundColor);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Fundo</h3>
        <p className="text-sm text-muted-foreground">
          Personalize a cor de fundo da sua página
        </p>
      </div>

      {/* Preset Colors - Circular Design */}
      <div className="space-y-3">
        <Label>Cores</Label>
        <div className="flex flex-wrap gap-3">
          {PRESET_COLORS.map((color) => {
            const isSelected = profile.globalBackgroundColor === color.value;
            const isDark = color.value === "#1A1A1A" || color.value === "#424242";
            
            return (
              <button
                key={color.value}
                onClick={() => handleColorSelect(color.value)}
                className={cn(
                  "w-10 h-10 rounded-full border-2 transition-all relative shadow-sm",
                  isSelected 
                    ? "border-primary ring-2 ring-primary/30 scale-110" 
                    : "border-gray-200 hover:border-gray-300 hover:scale-105"
                )}
                style={{ backgroundColor: color.value }}
                title={color.name}
              >
                {isSelected && (
                  <Check 
                    className={cn(
                      "absolute inset-0 m-auto h-4 w-4",
                      isDark ? "text-white" : "text-gray-700"
                    )} 
                  />
                )}
              </button>
            );
          })}
          
          {/* Custom Color Picker */}
          <div className="relative">
            <button
              className={cn(
                "w-10 h-10 rounded-full border-2 border-dashed transition-all flex items-center justify-center shadow-sm",
                isCustomColorSelected
                  ? "border-primary ring-2 ring-primary/30 scale-110"
                  : "border-gray-300 hover:border-gray-400 hover:scale-105"
              )}
              style={{ 
                backgroundColor: isCustomColorSelected ? customColor : "transparent" 
              }}
              title="Cor personalizada"
            >
              {isCustomColorSelected ? (
                <Check className="h-4 w-4 text-white mix-blend-difference" />
              ) : (
                <Pencil className="h-4 w-4 text-gray-400" />
              )}
            </button>
            <input
              type="color"
              value={customColor}
              onChange={(e) => handleColorSelect(e.target.value)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Custom Color Input */}
      <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3">
        <div 
          className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-inner"
          style={{ backgroundColor: profile.globalBackgroundColor || "#FFFFFF" }}
        />
        <input
          type="text"
          value={(profile.globalBackgroundColor || "#FFFFFF").toUpperCase()}
          onChange={(e) => {
            const value = e.target.value;
            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
              setCustomColor(value);
              if (value.length === 7) {
                onUpdate({ globalBackgroundColor: value });
              }
            }
          }}
          className="flex-1 bg-transparent text-sm font-mono text-muted-foreground"
          placeholder="#FFFFFF"
        />
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