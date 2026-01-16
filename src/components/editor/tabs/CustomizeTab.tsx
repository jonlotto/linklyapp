import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RotateCcw } from "lucide-react";
import { EditorProfile } from "@/hooks/useEditorState";

interface CustomizeTabProps {
  profile: EditorProfile;
  onUpdate: (updates: Partial<EditorProfile>) => void;
}

export function CustomizeTab({ profile, onUpdate }: CustomizeTabProps) {
  return (
    <div className="space-y-6">
      {/* Background Color */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Cor de Fundo</Label>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              type="color"
              value={profile.globalBackgroundColor || "#f5f5f5"}
              onChange={(e) => onUpdate({ globalBackgroundColor: e.target.value })}
              className="w-12 h-12 p-1 cursor-pointer rounded-lg border-2"
            />
          </div>
          <div className="flex-1">
            <Input
              type="text"
              value={profile.globalBackgroundColor || ""}
              onChange={(e) => onUpdate({ globalBackgroundColor: e.target.value })}
              placeholder="Ex: #ffffff ou usar seletor"
              className="font-mono text-sm"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onUpdate({ globalBackgroundColor: null })}
            title="Resetar para padrão do template"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Define a cor de fundo da sua página. Deixe vazio para usar o padrão do template.
        </p>
      </div>

      {/* Button Background Color */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Cor dos Botões</Label>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              type="color"
              value={profile.globalButtonBgColor || "#000000"}
              onChange={(e) => onUpdate({ globalButtonBgColor: e.target.value })}
              className="w-12 h-12 p-1 cursor-pointer rounded-lg border-2"
            />
          </div>
          <div className="flex-1">
            <Input
              type="text"
              value={profile.globalButtonBgColor || ""}
              onChange={(e) => onUpdate({ globalButtonBgColor: e.target.value })}
              placeholder="Ex: #000000 ou usar seletor"
              className="font-mono text-sm"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onUpdate({ globalButtonBgColor: null })}
            title="Resetar para padrão do template"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Define a cor de fundo de todos os botões. Cores individuais sobrescrevem esta configuração.
        </p>
      </div>

      {/* Button Text Color */}
      <div className="space-y-3">
        <Label className="text-base font-semibold">Cor do Texto</Label>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Input
              type="color"
              value={profile.globalButtonTextColor || "#ffffff"}
              onChange={(e) => onUpdate({ globalButtonTextColor: e.target.value })}
              className="w-12 h-12 p-1 cursor-pointer rounded-lg border-2"
            />
          </div>
          <div className="flex-1">
            <Input
              type="text"
              value={profile.globalButtonTextColor || ""}
              onChange={(e) => onUpdate({ globalButtonTextColor: e.target.value })}
              placeholder="Ex: #ffffff ou usar seletor"
              className="font-mono text-sm"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onUpdate({ globalButtonTextColor: null })}
            title="Resetar para padrão do template"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Define a cor do texto de todos os botões. Cores individuais sobrescrevem esta configuração.
        </p>
      </div>

      {/* Preview */}
      <div className="p-4 rounded-xl border bg-muted/30 space-y-3">
        <Label className="text-sm font-medium text-muted-foreground">Preview</Label>
        <div
          className="p-4 rounded-lg transition-all"
          style={{ backgroundColor: profile.globalBackgroundColor || "#f5f5f5" }}
        >
          <button
            className="w-full py-3 px-4 rounded-xl font-medium transition-all"
            style={{
              backgroundColor: profile.globalButtonBgColor || "#000000",
              color: profile.globalButtonTextColor || "#ffffff",
            }}
          >
            Exemplo de Botão
          </button>
        </div>
      </div>
    </div>
  );
}
