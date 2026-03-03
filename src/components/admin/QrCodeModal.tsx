import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download, Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { buildSubdomainUrl } from "@/utils/subdomain";
import { toast } from "sonner";

interface QrCodeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username?: string;
}

export function QrCodeModal({ open, onOpenChange, username }: QrCodeModalProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const url = username ? buildSubdomainUrl(username) : "";

  const handleDownload = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${username}-qrcode.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    toast.success("QR Code baixado!");
  };

  const handleCopy = async () => {
    if (!url) return;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-black border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>QR Code</DialogTitle>
          <DialogDescription className="text-white/60">
            Escaneie para acessar sua página
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          <div ref={canvasRef} className="bg-white p-4 rounded-xl">
            <QRCodeCanvas value={url} size={200} level="H" />
          </div>

          <p className="text-sm text-white/50 text-center break-all">{url}</p>

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
