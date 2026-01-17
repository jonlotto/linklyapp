import { ExternalLink } from "lucide-react";
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

interface LinkCardProps {
  title: string;
  url: string;
  icon?: string;
  delay?: number;
  buttonBgColor?: string;
  buttonTextColor?: string;
  buttonBorderRadius?: string;
  buttonStyle?: "filled" | "outline";
  fontFamily?: string;
}

const renderIcon = (icon: string | undefined) => {
  if (!icon) return null;
  if (icon === WHATSAPP_ICON_VALUE) {
    return <WhatsAppIcon className="w-4 h-4 shrink-0" title="WhatsApp" />;
  }
  if (icon === LINK_ICON_VALUE) {
    return <LinkIcon className="w-5 h-5 shrink-0" title="Link" />;
  }
  if (icon === CART_ICON_VALUE) {
    return <CartIcon className="w-5 h-5 shrink-0" title="Carrinho" />;
  }
  if (icon === STORE_ICON_VALUE) {
    return <StoreIcon className="w-5 h-5 shrink-0" title="Loja" />;
  }
  if (icon === STAR_ICON_VALUE) {
    return <StarIcon className="w-5 h-5 shrink-0" title="Estrela" />;
  }
  if (icon === LOCATION_ICON_VALUE) {
    return <LocationIcon className="w-5 h-5 shrink-0" title="Localização" />;
  }
  return <span className="text-xl shrink-0">{icon}</span>;
};

const LinkCard = ({ 
  title, 
  url, 
  icon, 
  delay = 0,
  buttonBgColor,
  buttonTextColor,
  buttonBorderRadius = "rounded-2xl",
  buttonStyle = "filled",
  fontFamily = "Inter"
}: LinkCardProps) => {
  const hasCustomColors = buttonBgColor || buttonTextColor;
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block w-full animate-slide-up opacity-0"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div 
        className={cn(
          "relative flex items-center justify-center px-6 py-4 transition-all duration-300 hover:scale-[1.02]",
          buttonBorderRadius,
          !hasCustomColors && "glass shadow-glow hover:shadow-glow-lg",
          buttonStyle === "outline" && hasCustomColors && "bg-transparent border-2"
        )}
        style={{
          fontFamily,
          ...(hasCustomColors ? {
            backgroundColor: buttonStyle === "filled" ? (buttonBgColor || undefined) : "transparent",
            color: buttonTextColor || undefined,
            borderColor: buttonStyle === "outline" ? (buttonBgColor || undefined) : undefined,
          } : {})
        }}
      >
        {icon && (
          <span className="absolute left-4">
            {renderIcon(icon)}
          </span>
        )}
        <span className={cn("font-medium text-sm", !hasCustomColors && "text-foreground")}>{title}</span>
      </div>
    </a>
  );
};

export default LinkCard;
