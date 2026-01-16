import { useState, useRef, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Move } from "lucide-react";

interface BannerCropModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  initialOffsetY?: number;
  onCropComplete: (croppedImageBlob: Blob, offsetY: number) => void;
}

// Match preview dimensions exactly: 320x160 = 2:1 aspect ratio
const ASPECT_RATIO = 2;
const OUTPUT_WIDTH = 640;
const OUTPUT_HEIGHT = 320;

export function BannerCropModal({
  open,
  onOpenChange,
  imageSrc,
  initialOffsetY = 0,
  onCropComplete,
}: BannerCropModalProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [offsetY, setOffsetY] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragStartRef = useRef({ y: 0, offsetY: 0 });

  // Reset state when modal opens - use initial offset if provided
  useEffect(() => {
    if (open) {
      setOffsetY(initialOffsetY);
      setImageLoaded(false);
    }
  }, [open, initialOffsetY]);

  const handleImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    setImageLoaded(true);
  }, []);

  // Calculate the visible frame dimensions
  const getFrameDimensions = useCallback(() => {
    const containerWidth = containerRef.current?.clientWidth || 400;
    const frameWidth = Math.min(containerWidth - 32, 500);
    const frameHeight = frameWidth / ASPECT_RATIO;
    return { frameWidth, frameHeight };
  }, []);

  // Calculate max offset based on image aspect ratio
  const getMaxOffset = useCallback(() => {
    if (!imageDimensions.width || !imageDimensions.height) return 0;
    const { frameWidth, frameHeight } = getFrameDimensions();
    
    // Image is scaled to fit frame width
    const scaledImageHeight = (imageDimensions.height / imageDimensions.width) * frameWidth;
    const maxOffset = Math.max(0, (scaledImageHeight - frameHeight) / 2);
    return maxOffset;
  }, [imageDimensions, getFrameDimensions]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartRef.current = { y: e.clientY, offsetY };
  }, [offsetY]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaY = e.clientY - dragStartRef.current.y;
    const maxOffset = getMaxOffset();
    const newOffset = Math.max(-maxOffset, Math.min(maxOffset, dragStartRef.current.offsetY + deltaY));
    setOffsetY(newOffset);
  }, [isDragging, getMaxOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartRef.current = { y: e.touches[0].clientY, offsetY };
  }, [offsetY]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaY = e.touches[0].clientY - dragStartRef.current.y;
    const maxOffset = getMaxOffset();
    const newOffset = Math.max(-maxOffset, Math.min(maxOffset, dragStartRef.current.offsetY + deltaY));
    setOffsetY(newOffset);
  }, [isDragging, getMaxOffset]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const getCroppedImage = useCallback(async (): Promise<Blob | null> => {
    const img = imageRef.current;
    if (!img || !imageDimensions.width) return null;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    canvas.width = OUTPUT_WIDTH;
    canvas.height = OUTPUT_HEIGHT;

    const { frameWidth, frameHeight } = getFrameDimensions();
    
    // Scale factor: image is scaled to fit frame width
    const scale = frameWidth / imageDimensions.width;
    const scaledImageHeight = imageDimensions.height * scale;
    
    // Initial center position (without any offset)
    const centerOffset = (scaledImageHeight - frameHeight) / 2;
    
    // When offsetY is positive, image moved DOWN, so we see the TOP of the image
    // visibleTopScaled = how far from the top of the scaled image the visible area starts
    const visibleTopScaled = centerOffset - offsetY;
    
    // Convert back to original image coordinates
    const sourceY = visibleTopScaled / scale;
    const sourceHeight = frameHeight / scale;
    
    // Clamp values to stay within image bounds
    const clampedSourceY = Math.max(0, Math.min(sourceY, imageDimensions.height - sourceHeight));
    const clampedSourceHeight = Math.min(sourceHeight, imageDimensions.height - clampedSourceY);

    ctx.drawImage(
      img,
      0,
      clampedSourceY,
      imageDimensions.width,
      clampedSourceHeight,
      0,
      0,
      OUTPUT_WIDTH,
      OUTPUT_HEIGHT
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/jpeg", 0.9);
    });
  }, [imageDimensions, offsetY, getFrameDimensions]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const blob = await getCroppedImage();
      if (blob) {
        onCropComplete(blob, offsetY);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const { frameWidth, frameHeight } = getFrameDimensions();
  const canDrag = imageLoaded && getMaxOffset() > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Ajustar imagem de capa</DialogTitle>
        </DialogHeader>

        <div 
          ref={containerRef}
          className="flex flex-col items-center py-4"
        >
          {/* Crop frame */}
          <div
            className="relative overflow-hidden rounded-xl border-2 border-primary/50 cursor-grab active:cursor-grabbing select-none"
            style={{ width: frameWidth, height: frameHeight }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Preview"
              crossOrigin="anonymous"
              onLoad={handleImageLoad}
              className="w-full pointer-events-none"
              style={{ 
                transform: `translateY(${offsetY}px)`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
              draggable={false}
            />

            {/* Drag indicator overlay */}
            {canDrag && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                <div className="bg-white/90 rounded-full p-2">
                  <Move className="h-5 w-5 text-gray-700" />
                </div>
              </div>
            )}
          </div>

          <p className="text-sm text-muted-foreground text-center mt-3">
            {canDrag ? "Arraste para ajustar a posição" : "Imagem ajustada automaticamente"}
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !imageLoaded}>
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Salvando...
              </>
            ) : (
              "Aplicar"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}