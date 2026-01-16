import { ExternalLink, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { templates } from "@/data/templates";
import { EditorProfile, EditorLink } from "@/hooks/useEditorState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import whatsappIcon from "@/assets/whatsapp.svg";

const WHATSAPP_ICON_VALUE = "whatsapp-icon";

const renderIcon = (icon: string | undefined) => {
  if (!icon) return null;
  if (icon === WHATSAPP_ICON_VALUE) {
    return <img src={whatsappIcon} alt="WhatsApp" className="w-5 h-5 inline-block mr-2" />;
  }
  return <span className="mr-2">{icon}</span>;
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

  return (
    <div className="flex flex-col items-center">
      {/* Phone Frame */}
      <div
        className={cn(
          "relative w-[320px] h-[640px] rounded-[3rem] border-8 border-foreground/20 shadow-2xl overflow-hidden",
          template.styles.background
        )}
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
                  className={cn(
                    "w-full cursor-pointer relative",
                    template.styles.bannerHeight || "h-40"
                  )}
                  onClick={() => onClickElement?.("banner")}
                >
                  {profile.bannerUrl ? (
                    <img
                      src={profile.bannerUrl}
                      alt="Banner"
                      className="w-full h-full object-cover"
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
              <div className={cn("pt-16 pb-6 px-6", template.styles.contentBg)}>
                {/* Username */}
                <p
                  className={cn(
                    "text-center text-sm mb-1 cursor-pointer hover:opacity-80 transition-opacity",
                    template.styles.textColor
                  )}
                  onClick={() => onClickElement?.("username")}
                >
                  @{profile.username || "usuario"}
                </p>

                {/* Display Name */}
                <h1
                  className={cn(
                    "text-center text-xl font-bold mb-2",
                    template.styles.textColor
                  )}
                >
                  {profile.displayName || "Nome de Exibição"}
                </h1>

                {/* Bio */}
                <p
                  className={cn(
                    "text-center text-sm mb-6 cursor-pointer hover:opacity-80 transition-opacity opacity-80",
                    template.styles.textColor
                  )}
                  onClick={() => onClickElement?.("bio")}
                >
                  {profile.bio || "Sua bio aqui..."}
                </p>

                {/* Buttons */}
                <div className="space-y-3 mb-6">
                  {buttons.map((link) => {
                    const hasCustomColors = link.buttonBgColor || link.buttonTextColor;
                    return (
                      <button
                        key={link.id}
                        className={cn(
                          "w-full py-3 px-4 font-medium transition-all hover:scale-[1.02] cursor-pointer text-center",
                          link.buttonBorderRadius || template.styles.buttonStyle,
                          !hasCustomColors && (
                            link.style === "filled"
                              ? cn(template.styles.buttonBg, template.styles.buttonText)
                              : cn("bg-transparent border-2", template.styles.textColor)
                          )
                        )}
                        style={hasCustomColors ? {
                          backgroundColor: link.buttonBgColor || undefined,
                          color: link.buttonTextColor || undefined,
                        } : undefined}
                        onClick={() => onClickElement?.("link", link.id)}
                      >
                        {renderIcon(link.icon)}
                        {link.title}
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
                          "w-10 h-10 rounded-full flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-pointer",
                          template.styles.cardBg,
                          template.styles.textColor
                        )}
                        onClick={() => onClickElement?.("link", social.id)}
                      >
                        {social.icon || "🔗"}
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
                  template.styles.textColor
                )}
                onClick={() => onClickElement?.("username")}
              >
                @{profile.username || "usuario"}
              </p>

              {/* Display Name */}
              <h1
                className={cn(
                  "text-center text-xl font-bold mb-2",
                  template.styles.textColor
                )}
              >
                {profile.displayName || "Nome de Exibição"}
              </h1>

              {/* Bio */}
              <p
                className={cn(
                  "text-center text-sm mb-6 cursor-pointer hover:opacity-80 transition-opacity opacity-80",
                  template.styles.textColor
                )}
                onClick={() => onClickElement?.("bio")}
              >
                {profile.bio || "Sua bio aqui..."}
              </p>

              {/* Buttons */}
              <div className="space-y-3 mb-6">
                {buttons.map((link) => {
                  const hasCustomColors = link.buttonBgColor || link.buttonTextColor;
                  return (
                    <button
                      key={link.id}
                      className={cn(
                        "w-full py-3 px-4 font-medium transition-all hover:scale-[1.02] cursor-pointer text-center",
                        link.buttonBorderRadius || template.styles.buttonStyle,
                        !hasCustomColors && (
                          link.style === "filled"
                            ? cn(template.styles.buttonBg, template.styles.buttonText)
                            : cn("bg-transparent border-2", template.styles.textColor)
                        )
                      )}
                      style={hasCustomColors ? {
                        backgroundColor: link.buttonBgColor || undefined,
                        color: link.buttonTextColor || undefined,
                      } : undefined}
                      onClick={() => onClickElement?.("link", link.id)}
                    >
                      {renderIcon(link.icon)}
                      {link.title}
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
                        "w-10 h-10 rounded-full flex items-center justify-center text-xl hover:scale-110 transition-transform cursor-pointer",
                        template.styles.cardBg,
                        template.styles.textColor
                      )}
                      onClick={() => onClickElement?.("link", social.id)}
                    >
                      {social.icon || "🔗"}
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