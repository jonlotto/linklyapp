import { useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Copy, Check, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { buildSubdomainUrl } from "@/utils/subdomain";
import { toast } from "sonner";
import customLogo from "@/assets/ft005-logo.png";

type QrStyle = "classic" | "logo" | "branded" | "transparent";

const STYLES: { key: QrStyle; label: string; description: string }[] = [
  { key: "classic", label: "Clássico", description: "Preto e branco" },
  { key: "logo", label: "Com Logo", description: "Logo BioBR no centro" },
  { key: "branded", label: "Temático", description: "Cores da marca" },
  { key: "transparent", label: "Transparente", description: "QR branco, sem fundo" },
];

interface QrCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username?: string;
}

export function QrCodeModal({ open, onOpenChange, username }: QrCodeModalProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState<QrStyle>("logo");
  const [mode, setMode] = useState<"bio" | "custom">("bio");
  const [customUrl, setCustomUrl] = useState("");
  const [confirmedCustomUrl, setConfirmedCustomUrl] = useState("");
  const bioUrl = username ? buildSubdomainUrl(username) : "";
  const isValidCustom = /^https?:\/\/.+/.test(customUrl.trim());
  const activeUrl = mode === "bio" ? bioUrl : confirmedCustomUrl;

  const handleGenerateCustom = () => {
    if (!isValidCustom) {
      toast.error("Insira um link válido (ex: https://exemplo.com)");
      return;
    }
    setConfirmedCustomUrl(customUrl.trim());
    toast.success("QR Code gerado!");
  };

  const handleDownload = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${mode === "bio" ? username : "custom"}-qrcode.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("QR Code baixado!");
  };

  const handleCopy = async () => {
    if (!activeUrl) return;
    await navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  const isTransparent = style === "transparent";
  const fgColor = isTransparent ? "#ffffff" : style === "branded" ? "#ff2264" : "#000000";
  const bgColor = isTransparent ? "rgba(0,0,0,0)" : "#ffffff";
  const showLogo = !isTransparent && (style === "logo" || style === "branded");
  const cornerColor = style === "branded" ? "#ff2264" : "#ffffff";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription className="text-white/60">
            Escolha o estilo e escaneie para acessar sua página
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-5 py-4">
          {/* Mode toggle */}
          <div className="flex gap-2 w-full">
            <button
              onClick={() => setMode("bio")}
              className={`flex-1 rounded-lg border px-3 py-2 text-center transition-all text-sm ${
                mode === "bio"
                  ? "border-[#ff2264] bg-[#ff2264]/10 text-white"
                  : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
              }`}
            >
              Minha página
            </button>
            <button
              onClick={() => setMode("custom")}
              className={`flex-1 rounded-lg border px-3 py-2 text-center transition-all text-sm ${
                mode === "custom"
                  ? "border-[#ff2264] bg-[#ff2264]/10 text-white"
                  : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
              }`}
            >
              <Link className="inline h-3.5 w-3.5 mr-1.5 -mt-0.5" />
              Link personalizado
            </button>
          </div>

          {/* Custom URL input */}
          {mode === "custom" && (
            <div className="flex gap-2 w-full">
              <Input
                placeholder="https://exemplo.com"
                value={customUrl}
                onChange={(e) => setCustomUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerateCustom()}
                className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-white/30"
              />
              <Button
                onClick={handleGenerateCustom}
                disabled={!isValidCustom}
                className="shrink-0"
              >
                Gerar
              </Button>
            </div>
          )}

          {/* Style selector */}
          <div className="flex gap-2 w-full">
            {STYLES.map((s) => (
              <button
                key={s.key}
                onClick={() => setStyle(s.key)}
                className={`flex-1 rounded-lg border px-3 py-2 text-center transition-all text-xs ${
                  style === s.key
                    ? "border-[#ff2264] bg-[#ff2264]/10 text-white"
                    : "border-white/10 text-white/50 hover:border-white/30 hover:text-white/80"
                }`}
              >
                <span className="block font-medium">{s.label}</span>
                <span className="block text-[10px] opacity-60">{s.description}</span>
              </button>
            ))}
          </div>

          {/* QR Code with frame */}
          <div className="relative p-6">
            {/* Corner brackets */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-[3px] border-l-[3px] rounded-tl-sm" style={{ borderColor: cornerColor }} />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-[3px] border-r-[3px] rounded-tr-sm" style={{ borderColor: cornerColor }} />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-[3px] border-l-[3px] rounded-bl-sm" style={{ borderColor: cornerColor }} />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-[3px] border-r-[3px] rounded-br-sm" style={{ borderColor: cornerColor }} />

            <div ref={canvasRef} className={`p-4 rounded-lg ${isTransparent ? "bg-black/40" : "bg-white"}`}>
              <QRCodeCanvas
                value={activeUrl || "https://placeholder"}
                size={200}
                level="H"
                fgColor={fgColor}
                bgColor={bgColor}
                imageSettings={
                  showLogo
                    ? {
                        src: customLogo,
                        height: 40,
                        width: 40,
                        excavate: true,
                      }
                    : undefined
                }
              />
            </div>
          </div>

          <p className="text-sm text-white/50 text-center break-all">{activeUrl}</p>

          <div className="flex gap-3 w-full">
            <Button
              variant="outline"
              className="flex-1 border-white/20 text-white hover:bg-white/10"
              onClick={handleCopy}
            >
              {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copiado" : "Copiar link"}
            </Button>
            <Button
              className="flex-1"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PNG
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
