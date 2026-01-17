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
import { EditorLink } from "@/hooks/useEditorState";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { LinkIcon } from "@/components/icons/LinkIcon";
import { CartIcon } from "@/components/icons/CartIcon";
import { StoreIcon } from "@/components/icons/StoreIcon";
import { StarIcon } from "@/components/icons/StarIcon";
import { LocationIcon } from "@/components/icons/LocationIcon";

const WHATSAPP_ICON_VALUE = "whatsapp-icon";
const LINK_ICON_VALUE = "link-icon";
const CART_ICON_VALUE = "cart-icon";
const STORE_ICON_VALUE = "store-icon";
const STAR_ICON_VALUE = "star-icon";
const LOCATION_ICON_VALUE = "location-icon";

const ICONS = [
  { value: "", label: "Nenhum" },
  { value: WHATSAPP_ICON_VALUE, label: "WhatsApp" },
  { value: LINK_ICON_VALUE, label: "Link" },
  { value: CART_ICON_VALUE, label: "Carrinho" },
  { value: STORE_ICON_VALUE, label: "Loja" },
  { value: STAR_ICON_VALUE, label: "Estrela" },
  { value: LOCATION_ICON_VALUE, label: "Localização" },
];

interface ButtonEditDrawerProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Pick<EditorLink, "title" | "url" | "icon" | "isActive">) => void;
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
  const [errors, setErrors] = useState<{ title?: string; url?: string; whatsapp?: string }>({});
  
  // Button type (link or whatsapp)
  const [buttonType, setButtonType] = useState<"link" | "whatsapp">("link");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [whatsappMessage, setWhatsappMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setIcon(initialData.icon || "");
      
      // Detect if it's a WhatsApp link
      if (initialData.url?.startsWith("https://wa.me/")) {
        setButtonType("whatsapp");
        try {
          const waUrl = new URL(initialData.url);
          const pathNumber = waUrl.pathname.replace("/", "");
          const message = waUrl.searchParams.get("text") || "";
          setWhatsappNumber(pathNumber);
          setWhatsappMessage(message);
        } catch {
          setWhatsappNumber(initialData.url.replace("https://wa.me/", "").split("?")[0]);
          setWhatsappMessage("");
        }
        setUrl("");
      } else {
        setButtonType("link");
        setUrl(initialData.url);
        setWhatsappNumber("");
        setWhatsappMessage("");
      }
    } else {
      setTitle("");
      setUrl("");
      setIcon("");
      setButtonType("link");
      setWhatsappNumber("");
      setWhatsappMessage("");
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
    const newErrors: { title?: string; url?: string; whatsapp?: string } = {};

    if (!title.trim()) {
      newErrors.title = "O título é obrigatório";
    }

    if (buttonType === "link") {
      if (!url.trim()) {
        newErrors.url = "O link é obrigatório";
      } else if (!validateUrl(url)) {
        newErrors.url = "Digite uma URL válida (ex: https://exemplo.com)";
      }
    } else {
      // WhatsApp validation
      const cleanNumber = whatsappNumber.replace(/\D/g, "");
      if (!cleanNumber) {
        newErrors.whatsapp = "O número é obrigatório";
      } else if (cleanNumber.length < 10) {
        newErrors.whatsapp = "Digite um número válido com DDD";
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let finalUrl: string;
    if (buttonType === "whatsapp") {
      const cleanNumber = whatsappNumber.replace(/\D/g, "");
      finalUrl = `https://wa.me/${cleanNumber}`;
      if (whatsappMessage.trim()) {
        finalUrl += `?text=${encodeURIComponent(whatsappMessage.trim())}`;
      }
    } else {
      finalUrl = url.trim();
    }

    onSave({
      title: title.trim(),
      url: finalUrl,
      icon: icon || null,
      isActive: initialData?.isActive ?? true,
    });
  };

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm max-h-[85vh] overflow-auto">
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

            {/* Button Type */}
            <div className="space-y-2">
              <Label>Tipo</Label>
              <RadioGroup
                value={buttonType}
                onValueChange={(v) => {
                  const newType = v as "link" | "whatsapp";
                  setButtonType(newType);
                  setErrors({});
                  // Auto-set WhatsApp icon when switching to WhatsApp
                  if (newType === "whatsapp" && !icon) {
                    setIcon(WHATSAPP_ICON_VALUE);
                  }
                }}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="link" id="type-link" />
                  <Label htmlFor="type-link" className="font-normal cursor-pointer">
                    Link
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="whatsapp" id="type-whatsapp" />
                  <Label htmlFor="type-whatsapp" className="font-normal cursor-pointer">
                    WhatsApp
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {/* URL or WhatsApp */}
            {buttonType === "link" ? (
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
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp">Número do WhatsApp *</Label>
                  <Input
                    id="whatsapp"
                    type="tel"
                    value={whatsappNumber}
                    onChange={(e) => {
                      setWhatsappNumber(e.target.value.replace(/\D/g, ""));
                      setErrors((prev) => ({ ...prev, whatsapp: undefined }));
                    }}
                    placeholder="5511999999999"
                  />
                  <p className="text-xs text-muted-foreground">
                    Digite com código do país e DDD (ex: 5511999999999)
                  </p>
                  {errors.whatsapp && (
                    <p className="text-xs text-destructive">{errors.whatsapp}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-message">Mensagem pré-definida (opcional)</Label>
                  <Input
                    id="whatsapp-message"
                    value={whatsappMessage}
                    onChange={(e) => setWhatsappMessage(e.target.value)}
                    placeholder="Olá! Vim pelo seu link..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Texto que aparece automaticamente ao abrir a conversa
                  </p>
                </div>
              </div>
            )}

            {/* Icon */}
            <div className="space-y-2">
              <Label className="text-center block text-xs">Ícone (opcional)</Label>
              <div className="flex gap-2 justify-start">
                {ICONS.map((i) => {
                  const isSelected = icon === i.value || (icon === "" && i.value === "");
                  return (
                    <button
                      key={i.value || "none"}
                      type="button"
                      onClick={() => setIcon(i.value)}
                      className={cn(
                        "w-10 h-10 flex items-center justify-center border-2 rounded-lg transition-all",
                        isSelected
                          ? "border-primary bg-primary/10"
                          : "border-muted hover:border-muted-foreground/50"
                      )}
                      title={i.label}
                    >
                      {i.value === "" && <span className="text-xs text-muted-foreground">—</span>}
                      {i.value === WHATSAPP_ICON_VALUE && <WhatsAppIcon className="w-5 h-5" />}
                      {i.value === LINK_ICON_VALUE && <LinkIcon className="w-5 h-5" />}
                      {i.value === CART_ICON_VALUE && <CartIcon className="w-5 h-5" />}
                      {i.value === STORE_ICON_VALUE && <StoreIcon className="w-5 h-5" />}
                      {i.value === STAR_ICON_VALUE && <StarIcon className="w-5 h-5" />}
                      {i.value === LOCATION_ICON_VALUE && <LocationIcon className="w-5 h-5" />}
                    </button>
                  );
                })}
              </div>
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