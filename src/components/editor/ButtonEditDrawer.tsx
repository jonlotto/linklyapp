import { useEffect, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditorLink } from "@/hooks/useEditorState";

const ICONS = [
  { value: "", label: "Nenhum" },
  { value: "🔗", label: "🔗 Link" },
  { value: "🌐", label: "🌐 Web" },
  { value: "📧", label: "📧 Email" },
  { value: "📱", label: "📱 Telefone" },
  { value: "🛒", label: "🛒 Loja" },
  { value: "📝", label: "📝 Blog" },
  { value: "🎨", label: "🎨 Portfolio" },
  { value: "📅", label: "📅 Agenda" },
  { value: "🎁", label: "🎁 Promoção" },
  { value: "⭐", label: "⭐ Destaque" },
  { value: "🚀", label: "🚀 Lançamento" },
];

interface ButtonEditDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Omit<EditorLink, "id" | "order" | "linkType">) => void;
  initialData?: EditorLink | null;
}

export function ButtonEditDrawer({
  open,
  onClose,
  onSave,
  initialData,
}: ButtonEditDrawerProps) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("");
  const [style, setStyle] = useState<"filled" | "outline">("filled");
  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setUrl(initialData.url);
      setIcon(initialData.icon || "");
      setStyle(initialData.style);
    } else {
      setTitle("");
      setUrl("");
      setIcon("");
      setStyle("filled");
    }
    setErrors({});
  }, [initialData, open]);

  const validateUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleSave = () => {
    const newErrors: { title?: string; url?: string } = {};

    if (!title.trim()) {
      newErrors.title = "O título é obrigatório";
    }

    if (!url.trim()) {
      newErrors.url = "O link é obrigatório";
    } else if (!validateUrl(url)) {
      newErrors.url = "Digite uma URL válida (ex: https://exemplo.com)";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      title: title.trim(),
      url: url.trim(),
      icon: icon || null,
      style,
      isActive: initialData?.isActive ?? true,
    });
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              {initialData ? "Editar Botão" : "Novo Botão"}
            </DrawerTitle>
            <DrawerDescription>
              Configure as informações do botão.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setErrors((prev) => ({ ...prev, title: undefined }));
                }}
                placeholder="Ex: Meu Site"
              />
              {errors.title && (
                <p className="text-xs text-destructive">{errors.title}</p>
              )}
            </div>

            {/* URL */}
            <div className="space-y-2">
              <Label htmlFor="url">Link (URL) *</Label>
              <Input
                id="url"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setErrors((prev) => ({ ...prev, url: undefined }));
                }}
                placeholder="https://exemplo.com"
              />
              {errors.url && (
                <p className="text-xs text-destructive">{errors.url}</p>
              )}
            </div>

            {/* Icon */}
            <div className="space-y-2">
              <Label htmlFor="icon">Ícone (opcional)</Label>
              <Select value={icon} onValueChange={setIcon}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um ícone" />
                </SelectTrigger>
                <SelectContent>
                  {ICONS.map((i) => (
                    <SelectItem key={i.value} value={i.value || "none"}>
                      {i.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Style */}
            <div className="space-y-2">
              <Label>Estilo</Label>
              <RadioGroup
                value={style}
                onValueChange={(v) => setStyle(v as "filled" | "outline")}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="filled" id="filled" />
                  <Label htmlFor="filled" className="font-normal cursor-pointer">
                    Preenchido
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="outline" id="outline" />
                  <Label htmlFor="outline" className="font-normal cursor-pointer">
                    Outline
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <DrawerFooter>
            <Button onClick={handleSave}>Salvar</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
