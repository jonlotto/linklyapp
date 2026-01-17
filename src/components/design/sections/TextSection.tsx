import { useState } from "react";
import { Check, ChevronRight, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { EditorProfile } from "@/hooks/useEditorState";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface TextSectionProps {
  profile: EditorProfile;
  onUpdate: (updates: Partial<EditorProfile>) => void;
}

const FONTS = [
  { id: "Inter", label: "Inter", category: "Sans Serif" },
  { id: "Poppins", label: "Poppins", category: "Sans Serif" },
  { id: "Roboto", label: "Roboto", category: "Sans Serif" },
  { id: "Montserrat", label: "Montserrat", category: "Sans Serif" },
  { id: "Lato", label: "Lato", category: "Sans Serif" },
  { id: "Raleway", label: "Raleway", category: "Sans Serif" },
  { id: "Nunito", label: "Nunito", category: "Sans Serif" },
  { id: "Playfair Display", label: "Playfair Display", category: "Serif" },
];

const PRESET_TITLE_COLORS = [
  { name: "Preto", value: "#1A1A1A" },
  { name: "Cinza Escuro", value: "#374151" },
  { name: "Cinza", value: "#6B7280" },
  { name: "Branco", value: "#FFFFFF" },
  { name: "Coral", value: "#FF7F6B" },
  { name: "Azul", value: "#3B82F6" },
  { name: "Roxo", value: "#8B5CF6" },
  { name: "Rosa", value: "#EC4899" },
];

export function TextSection({ profile, onUpdate }: TextSectionProps) {
  const [customTitleColor, setCustomTitleColor] = useState(profile.titleColor || "#1A1A1A");
  const [fontSheetOpen, setFontSheetOpen] = useState(false);

  const isCustomColorSelected = profile.titleColor && 
    !PRESET_TITLE_COLORS.some(c => c.value === profile.titleColor);

  const selectedFont = FONTS.find(f => f.id === profile.titleFont) || FONTS[0];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Texto</h3>
        <p className="text-sm text-muted-foreground">
          Edite as informações e estilo do seu perfil
        </p>
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <Label htmlFor="displayName">Nome de exibição</Label>
        <Input
          id="displayName"
          value={profile.displayName}
          onChange={(e) => onUpdate({ displayName: e.target.value })}
          placeholder="Seu nome"
        />
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">Nome de usuário</Label>
        <div className="flex items-center">
          <span className="px-3 py-2 bg-muted rounded-l-lg border border-r-0 border-border text-muted-foreground text-sm">
            linklyapp.lovable.app/
          </span>
          <Input
            id="username"
            value={profile.username}
            onChange={(e) => onUpdate({ username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })}
            placeholder="usuario"
            className="rounded-l-none"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Apenas letras minúsculas, números, hífen e underscore
        </p>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={profile.bio}
          onChange={(e) => onUpdate({ bio: e.target.value })}
          placeholder="Uma breve descrição sobre você..."
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          {profile.bio.length}/150 caracteres
        </p>
      </div>

      {/* Typography Section */}
      <div className="pt-4 border-t">
        <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wide">
          Tipografia
        </h4>

        {/* Font Selector */}
        <div className="space-y-3">
          <Label>Fonte do título</Label>
          <Sheet open={fontSheetOpen} onOpenChange={setFontSheetOpen}>
            <SheetTrigger asChild>
              <button className="w-full py-3 px-4 bg-muted/50 rounded-xl flex justify-between items-center hover:bg-muted transition-colors">
                <span className="text-sm text-muted-foreground">Fonte</span>
                <span className="font-medium flex items-center gap-1" style={{ fontFamily: selectedFont.id }}>
                  {selectedFont.label}
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </span>
              </button>
            </SheetTrigger>
            <SheetContent side="bottom" className="h-[70vh]">
              <SheetHeader>
                <SheetTitle>Escolher fonte</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-2 overflow-y-auto max-h-[calc(70vh-100px)]">
                {FONTS.map((font) => {
                  const isSelected = profile.titleFont === font.id;
                  return (
                    <button
                      key={font.id}
                      onClick={() => {
                        onUpdate({ titleFont: font.id });
                        setFontSheetOpen(false);
                      }}
                      className={cn(
                        "w-full py-4 px-4 rounded-xl flex justify-between items-center transition-all",
                        isSelected 
                          ? "bg-primary/10 border-2 border-primary" 
                          : "bg-muted/50 hover:bg-muted border-2 border-transparent"
                      )}
                    >
                      <div className="text-left">
                        <span 
                          className="text-lg font-medium block" 
                          style={{ fontFamily: font.id }}
                        >
                          {font.label}
                        </span>
                        <span className="text-xs text-muted-foreground">{font.category}</span>
                      </div>
                      {isSelected && <Check className="h-5 w-5 text-primary" />}
                    </button>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Title Color */}
        <div className="space-y-3 mt-4">
          <Label>Cor do título</Label>
          <div className="flex flex-wrap gap-3">
            {PRESET_TITLE_COLORS.map((color) => {
              const isSelected = profile.titleColor === color.value;
              
              return (
                <button
                  key={color.value}
                  onClick={() => {
                    setCustomTitleColor(color.value);
                    onUpdate({ titleColor: color.value });
                  }}
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
                        color.value === "#FFFFFF" || color.value === "#6B7280" ? "text-gray-700" : "text-white"
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
                  backgroundColor: isCustomColorSelected ? customTitleColor : "transparent" 
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
                value={customTitleColor}
                onChange={(e) => {
                  setCustomTitleColor(e.target.value);
                  onUpdate({ titleColor: e.target.value });
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
          </div>

          {/* Color Value Display */}
          <div className="flex items-center gap-3 bg-muted/50 rounded-xl px-4 py-3">
            <div 
              className="w-8 h-8 rounded-full border-2 border-gray-200 shadow-inner"
              style={{ backgroundColor: profile.titleColor || "#1A1A1A" }}
            />
            <input
              type="text"
              value={(profile.titleColor || "#1A1A1A").toUpperCase()}
              onChange={(e) => {
                const value = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                  setCustomTitleColor(value);
                  if (value.length === 7) {
                    onUpdate({ titleColor: value });
                  }
                }
              }}
              className="flex-1 bg-transparent text-sm font-mono text-muted-foreground"
            />
          </div>
        </div>

        {/* Title Size */}
        <div className="space-y-3 mt-4">
          <Label>Tamanho do título</Label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdate({ titleSize: "small" })}
              className={cn(
                "py-3 rounded-xl border-2 font-medium transition-all",
                profile.titleSize === "small"
                  ? "border-primary bg-white"
                  : "border-gray-200 bg-gray-50 text-muted-foreground hover:border-gray-300"
              )}
            >
              Pequeno
            </button>
            <button
              onClick={() => onUpdate({ titleSize: "large" })}
              className={cn(
                "py-3 rounded-xl border-2 font-medium transition-all",
                profile.titleSize === "large"
                  ? "border-primary bg-white"
                  : "border-gray-200 bg-gray-50 text-muted-foreground hover:border-gray-300"
              )}
            >
              Grande
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}