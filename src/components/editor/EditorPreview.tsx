import { ExternalLink, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { templates } from "@/data/templates";
import { EditorProfile, EditorLink } from "@/hooks/useEditorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";
import { LinkIcon } from "@/components/icons/LinkIcon";
import { CartIcon } from "@/components/icons/CartIcon";
import { StoreIcon } from "@/components/icons/StoreIcon";
import { StarIcon } from "@/components/icons/StarIcon";
import { LocationIcon } from "@/components/icons/LocationIcon";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import { TikTokIcon } from "@/components/icons/TikTokIcon";
import { YouTubeIcon } from "@/components/icons/YouTubeIcon";
import { TwitterIcon } from "@/components/icons/TwitterIcon";
import { LinkedInIcon } from "@/components/icons/LinkedInIcon";
import { EmailIcon } from "@/components/icons/EmailIcon";

const WHATSAPP_ICON_VALUE = "whatsapp-icon";
const LINK_ICON_VALUE = "link-icon";
const CART_ICON_VALUE = "cart-icon";
const STORE_ICON_VALUE = "store-icon";
const STAR_ICON_VALUE = "star-icon";
const LOCATION_ICON_VALUE = "location-icon";
const INSTAGRAM_ICON_VALUE = "instagram-icon";
const TIKTOK_ICON_VALUE = "tiktok-icon";
const YOUTUBE_ICON_VALUE = "youtube-icon";
const TWITTER_ICON_VALUE = "twitter-icon";
const LINKEDIN_ICON_VALUE = "linkedin-icon";
const EMAIL_ICON_VALUE = "email-icon";

const renderIcon = (icon: string | undefined, size: "sm" | "md" = "sm") => {
  if (!icon) return null;
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";
  
  if (icon === WHATSAPP_ICON_VALUE) {
    return <WhatsAppIcon className={cn(sizeClass, "shrink-0")} title="WhatsApp" />;
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
  if (icon === INSTAGRAM_ICON_VALUE) {
    return <InstagramIcon className={cn(sizeClass, "shrink-0")} title="Instagram" />;
  }
  if (icon === TIKTOK_ICON_VALUE) {
    return <TikTokIcon className={cn(sizeClass, "shrink-0")} title="TikTok" />;
  }
  if (icon === YOUTUBE_ICON_VALUE) {
    return <YouTubeIcon className={cn(sizeClass, "shrink-0")} title="YouTube" />;
  }
  if (icon === TWITTER_ICON_VALUE) {
    return <TwitterIcon className={cn(sizeClass, "shrink-0")} title="Twitter" />;
  }
  if (icon === LINKEDIN_ICON_VALUE) {
    return <LinkedInIcon className={cn(sizeClass, "shrink-0")} title="LinkedIn" />;
  }
  if (icon === EMAIL_ICON_VALUE) {
    return <EmailIcon className={cn(sizeClass, "shrink-0")} title="Email" />;
  }
  return <span className="shrink-0">{icon}</span>;
};

interface EditorPreviewProps {
  profile: EditorProfile;
  links: EditorLink[];
  onClickElement?: (type: "avatar" | "username" | "bio" | "link" | "banner", linkId?: string) => void;
}

export function EditorPreview({ profile, links, onClickElement }: EditorPreviewProps) {
  const template = templates.find((t) => t.slug === profile.templateSlug) || templates[0];
  const activeLinks = links.filter((l) => l.isActive).sort((a, b) => a.order - b.order);
  const buttons = activeLinks.filter((l) => l.linkType === "button");
  const socials = activeLinks.filter((l) => l.linkType === "social");

  const openPreview = () => {
    if (profile.username) {
      window.open(`/${profile.username}`, "_blank");
    }
  };

  const hasBanner = template.hasBanner;

  // Build background style with global color override or template image
  const getBackgroundStyle = () => {
    if (profile.globalBackgroundColor) {
      return { backgroundColor: profile.globalBackgroundColor };
    }
    if (template.styles.backgroundType === "image" && template.styles.backgroundImage) {
      return {
        backgroundImage: `url(${template.styles.backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    return undefined;
  };

  const backgroundStyle = getBackgroundStyle();
  const hasImageBackground = template.styles.backgroundType === "image" && template.styles.backgroundImage && !profile.globalBackgroundColor;

  return (
    <div className="flex flex-col items-center">
      {/* Phone Frame */}
      <div
        className={cn(
          "relative w-[320px] h-[640px] rounded-[3rem] border-8 border-foreground/20 shadow-2xl overflow-hidden",
          !profile.globalBackgroundColor && !hasImageBackground && template.styles.background
        )}
        style={backgroundStyle}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-foreground/20 rounded-b-2xl z-10" />

        {/* Content */}
        <div className="h-full overflow-auto">
          {hasBanner ? (
            <>
              {/* Banner Layout */}
              <div className="relative">
                {/* Banner Image */}
                <div
                  className="w-full cursor-pointer relative aspect-[2/1]"
                  onClick={() => onClickElement?.("banner")}
                >
                  {profile.bannerUrl ? (
                    <img
                      src={profile.bannerUrl}
                      alt="Banner"
                      className="w-full h-full object-fill"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                {/* Avatar overlapping banner */}
                <div
                  className="absolute left-1/2 transform -translate-x-1/2 -bottom-12 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => onClickElement?.("avatar")}
                >
                  <Avatar
                    className={cn("w-24 h-24", template.styles.avatarBorder)}
                  >
                    <AvatarImage src={profile.avatarUrl || undefined} />
                    <AvatarFallback
                      className={cn(template.styles.cardBg, template.styles.textColor)}
                    >
                      {profile.displayName?.charAt(0) || profile.username?.charAt(0) || "?"}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Content below banner */}
              <div 
                className={cn("pt-16 pb-6 px-6", !profile.globalBackgroundColor && template.styles.contentBg)}
                style={profile.globalBackgroundColor ? { backgroundColor: profile.globalBackgroundColor } : undefined}
              >
              {/* Username */}
              <p
                className={cn(
                  "text-center text-sm mb-1 cursor-pointer hover:opacity-80 transition-opacity",
                  !profile.titleColor && template.styles.textColor
                )}
                style={{ 
                  fontFamily: profile.titleFont || "Inter",
                  color: profile.titleColor || undefined
                }}
                onClick={() => onClickElement?.("username")}
              >
                @{profile.username || "usuario"}
              </p>

                {/* Display Name */}
                <h1
                  className={cn(
                    "text-center font-bold mb-2",
                    profile.titleSize === "small" ? "text-lg" : "text-xl",
                    !profile.titleColor && template.styles.textColor
                  )}
                  style={{ 
                    fontFamily: profile.titleFont || "Inter",
                    color: profile.titleColor || undefined 
                  }}
                >
                  {profile.displayName || "Nome de Exibição"}
                </h1>

                {/* Bio */}
                <p
                  className={cn(
                    "text-center text-sm mb-6 cursor-pointer hover:opacity-80 transition-opacity opacity-80",
                    !profile.titleColor && template.styles.textColor
                  )}
                  style={{ 
                    fontFamily: profile.titleFont || "Inter",
                    color: profile.titleColor || undefined
                  }}
                  onClick={() => onClickElement?.("bio")}
                >
                  {profile.bio || "Sua bio aqui..."}
                </p>

                {/* Buttons */}
                <div className="space-y-3 mb-6">
                  {buttons.map((link) => {
                    // Use global styles from profile
                    const bgColor = profile.globalButtonBgColor;
                    const textColor = profile.globalButtonTextColor;
                    const borderRadius = profile.globalButtonBorderRadius || "rounded-xl";
                    const buttonStyle = profile.globalButtonStyle || "filled";
                    const hasCustomColors = bgColor || textColor;
                    return (
                      <button
                        key={link.id}
                        className={cn(
                          "w-full py-3 px-4 font-medium transition-all hover:scale-[1.02] cursor-pointer relative flex items-center justify-center",
                          borderRadius,
                          !hasCustomColors && (
                            buttonStyle === "filled"
                              ? cn(template.styles.buttonBg, template.styles.buttonText)
                              : cn("bg-transparent border-2", template.styles.textColor)
                          ),
                          buttonStyle === "outline" && hasCustomColors && "bg-transparent border-2"
                        )}
                        style={{
                          fontFamily: profile.titleFont || "Inter",
                          ...(hasCustomColors ? {
                            backgroundColor: buttonStyle === "filled" ? (bgColor || undefined) : "transparent",
                            color: textColor || undefined,
                            borderColor: buttonStyle === "outline" ? (bgColor || undefined) : undefined,
                          } : {})
                        }}
                        onClick={() => onClickElement?.("link", link.id)}
                      >
                        {link.icon && (
                          <span className="absolute left-4">
                            {renderIcon(link.icon)}
                          </span>
                        )}
                        <span className="text-sm">{link.title}</span>
                      </button>
                    );
                  })}
                  {buttons.length === 0 && (
                    <div
                      className={cn(
                        "w-full py-3 px-4 rounded-xl text-center opacity-50 border-2 border-dashed border-current",
                        template.styles.textColor
                      )}
                    >
                      Adicione seus botões
                    </div>
                  )}
                </div>

                {/* Social Icons */}
                {socials.length > 0 && (
                  <div className="flex justify-center gap-4 flex-wrap">
                    {socials.map((social) => (
                      <button
                        key={social.id}
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer",
                          template.styles.cardBg,
                          !profile.titleColor && template.styles.textColor
                        )}
                        style={{ color: profile.titleColor || undefined }}
                        onClick={() => onClickElement?.("link", social.id)}
                      >
                        {renderIcon(social.icon, "md") || "🔗"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            /* Standard Layout */
            <div className="p-6 pt-10">
              {/* Avatar */}
              <div
                className="flex justify-center mb-4 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => onClickElement?.("avatar")}
              >
                <Avatar
                  className={cn("w-24 h-24", template.styles.avatarBorder)}
                >
                  <AvatarImage src={profile.avatarUrl || undefined} />
                  <AvatarFallback
                    className={cn(template.styles.cardBg, template.styles.textColor)}
                  >
                    {profile.displayName?.charAt(0) || profile.username?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Username */}
              <p
                className={cn(
                  "text-center text-sm mb-1 cursor-pointer hover:opacity-80 transition-opacity",
                  !profile.titleColor && template.styles.textColor
                )}
                style={{ 
                  fontFamily: profile.titleFont || "Inter",
                  color: profile.titleColor || undefined
                }}
                onClick={() => onClickElement?.("username")}
              >
                @{profile.username || "usuario"}
              </p>

              {/* Display Name */}
              <h1
                className={cn(
                  "text-center font-bold mb-2",
                  profile.titleSize === "small" ? "text-lg" : "text-xl",
                  !profile.titleColor && template.styles.textColor
                )}
                style={{ 
                  fontFamily: profile.titleFont || "Inter",
                  color: profile.titleColor || undefined 
                }}
              >
                {profile.displayName || "Nome de Exibição"}
              </h1>

              {/* Bio */}
              <p
                className={cn(
                  "text-center text-sm mb-6 cursor-pointer hover:opacity-80 transition-opacity opacity-80",
                  !profile.titleColor && template.styles.textColor
                )}
                style={{ 
                  fontFamily: profile.titleFont || "Inter",
                  color: profile.titleColor || undefined
                }}
                onClick={() => onClickElement?.("bio")}
              >
                {profile.bio || "Sua bio aqui..."}
              </p>

              {/* Buttons */}
              <div className="space-y-3 mb-6">
                {buttons.map((link) => {
                  // Use global styles from profile
                  const bgColor = profile.globalButtonBgColor;
                  const textColor = profile.globalButtonTextColor;
                  const borderRadius = profile.globalButtonBorderRadius || "rounded-xl";
                  const buttonStyle = profile.globalButtonStyle || "filled";
                  const hasCustomColors = bgColor || textColor;
                  return (
                    <button
                      key={link.id}
                      className={cn(
                        "w-full py-3 px-4 font-medium transition-all hover:scale-[1.02] cursor-pointer relative flex items-center justify-center",
                        borderRadius,
                        !hasCustomColors && (
                          buttonStyle === "filled"
                            ? cn(template.styles.buttonBg, template.styles.buttonText)
                            : cn("bg-transparent border-2", template.styles.textColor)
                        ),
                        buttonStyle === "outline" && hasCustomColors && "bg-transparent border-2"
                      )}
                      style={{
                        fontFamily: profile.titleFont || "Inter",
                        ...(hasCustomColors ? {
                          backgroundColor: buttonStyle === "filled" ? (bgColor || undefined) : "transparent",
                          color: textColor || undefined,
                          borderColor: buttonStyle === "outline" ? (bgColor || undefined) : undefined,
                        } : {})
                      }}
                      onClick={() => onClickElement?.("link", link.id)}
                    >
                      {link.icon && (
                        <span className="absolute left-4">
                          {renderIcon(link.icon)}
                        </span>
                      )}
                      <span className="text-sm">{link.title}</span>
                    </button>
                  );
                })}
                {buttons.length === 0 && (
                  <div
                    className={cn(
                      "w-full py-3 px-4 rounded-xl text-center opacity-50 border-2 border-dashed border-current",
                      template.styles.textColor
                    )}
                  >
                    Adicione seus botões
                  </div>
                )}
              </div>

              {socials.length > 0 && (
                <div className="flex justify-center gap-4 flex-wrap">
                  {socials.map((social) => (
                    <button
                      key={social.id}
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform cursor-pointer",
                        template.styles.cardBg,
                        !profile.titleColor && template.styles.textColor
                      )}
                      style={{ color: profile.titleColor || undefined }}
                      onClick={() => onClickElement?.("link", social.id)}
                    >
                      {renderIcon(social.icon, "md") || "🔗"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Open in new tab button */}
      <Button
        variant="outline"
        size="sm"
        className="mt-4"
        onClick={openPreview}
        disabled={!profile.username}
      >
        <ExternalLink className="h-4 w-4 mr-2" />
        Abrir em nova aba
      </Button>
    </div>
  );
}