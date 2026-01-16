import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  urlTemplate: string;
  isPhone?: boolean;
}

interface SocialAddModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (username: string) => void;
  platform: SocialPlatform | null;
}

export function SocialAddModal({
  open,
  onClose,
  onSave,
  platform,
}: SocialAddModalProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setValue("");
      setError("");
    }
  }, [open]);

  const handleSave = () => {
    if (!value.trim()) {
      setError(platform?.isPhone ? "Digite o número de telefone" : "Digite o nome de usuário");
      return;
    }

    onSave(value.trim());
    setValue("");
  };

  const getPlaceholder = () => {
    if (!platform) return "";
    if (platform.isPhone) return "+55 11 99999-9999";
    return "seunome";
  };

  const getPreviewUrl = () => {
    if (!platform || !value) return "";
    if (platform.isPhone) {
      return platform.urlTemplate.replace("{phone}", value.replace(/\D/g, ""));
    }
    return platform.urlTemplate.replace("{username}", value);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">{platform?.icon}</span>
            Adicionar {platform?.name}
          </DialogTitle>
          <DialogDescription>
            {platform?.isPhone
              ? "Digite seu número de telefone com código do país."
              : "Digite seu nome de usuário na plataforma."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="value">
              {platform?.isPhone ? "Número de telefone" : "Nome de usuário"}
            </Label>
            <Input
              id="value"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
              placeholder={getPlaceholder()}
              autoFocus
            />
            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          {value && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground mb-1">Preview do link:</p>
              <p className="text-sm break-all">{getPreviewUrl()}</p>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
