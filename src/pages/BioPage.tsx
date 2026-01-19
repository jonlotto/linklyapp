import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProfileHeader from "@/components/ProfileHeader";
import LinkCard, { renderIcon } from "@/components/LinkCard";
import { Link2 } from "lucide-react";
import { templates } from "@/data/templates";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<"profiles">;
type LinkType = Tables<"links">;

const BioPage = () => {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const fetchProfile = async () => {
    try {
      // Fetch profile by username
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username?.toLowerCase())
        .single();

      if (profileError || !profileData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Fetch active links
      const { data: linksData } = await supabase
        .from("links")
        .select("*")
        .eq("user_id", profileData.user_id)
        .eq("is_active", true)
        .order("position", { ascending: true });

      setLinks(linksData || []);
    } catch (error) {
      console.error("Error fetching profile:", error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-24 w-24 rounded-full bg-card/50 mx-auto mb-4" />
          <div className="h-6 w-32 bg-card/50 rounded-lg mx-auto mb-2" />
          <div className="h-4 w-24 bg-card/50 rounded-lg mx-auto" />
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="text-center animate-fade-in">
          <div className="glass-strong rounded-3xl p-8 max-w-md mx-auto">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted mx-auto mb-4">
              <Link2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="font-display text-2xl font-bold mb-2">
              Página não encontrada
            </h1>
            <p className="text-muted-foreground mb-6">
              O usuário @{username} não existe ou não tem uma página pública.
            </p>
            <button
              onClick={() => navigate("/")}
              className="text-primary hover:underline"
            >
              Voltar ao início
            </button>
          </div>
        </div>
      </div>
    );
  }

  const template = templates.find((t) => t.slug === profile?.template_slug) || templates[0];
  const hasBanner = template.hasBanner;
  const hasCurvedBanner = template.hasCurvedBanner;

  // Separate links by type
  const buttons = links.filter(l => l.link_type !== "social");
  const socials = links.filter(l => l.link_type === "social");

  // Build background style with global color/image override or template image
  const globalBgColor = profile?.global_background_color;
  const globalBgImage = (profile as any)?.global_background_image;
  const textColor = profile?.global_button_text_color || template.styles.textColor;

  const getBackgroundStyle = (): React.CSSProperties | undefined => {
    // 1. Custom background image has highest priority
    if (globalBgImage) {
      return {
        backgroundImage: `url(${globalBgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      };
    }
    // 2. Custom color or gradient
    if (globalBgColor) {
      if (globalBgColor.startsWith("linear-gradient")) {
        return { background: globalBgColor };
      }
      return { backgroundColor: globalBgColor };
    }
    // 3. Template background image
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
  const hasCustomBackground = !!globalBgImage || !!globalBgColor;
  const hasTemplateImageBg = template.styles.backgroundType === "image" && template.styles.backgroundImage;

  return (
    <div 
      className={cn("min-h-screen", !hasCustomBackground && !hasTemplateImageBg && template.styles.background)}
      style={backgroundStyle}
    >
      {hasBanner && profile ? (
        // Banner Layout - centered container for consistent look
        <div className="min-h-screen flex flex-col items-center">
          <div className="w-full max-w-md">
            {/* Banner Container - unified 8:5 aspect ratio */}
            <div className={cn(
              "relative w-full",
              hasCurvedBanner ? "aspect-[8/5]" : "aspect-[8/5]"
            )}>
              {/* Banner Image - fills entire container */}
              {profile.banner_url ? (
                <img
                  src={profile.banner_url}
                  alt="Banner"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/30 to-accent/30" />
              )}
              
              {/* Curved wave overlay - white cutout at bottom */}
              {hasCurvedBanner && (
                <svg 
                  viewBox="0 0 320 40" 
                  className="absolute bottom-0 left-0 w-full h-[40px]"
                  preserveAspectRatio="none"
                >
                  <path 
                    d="M0,40 Q160,0 320,40 L320,40 L0,40 Z" 
                    fill={hasCustomBackground ? "transparent" : "#ffffff"}
                  />
                </svg>
              )}
              
              {/* Avatar overlapping banner */}
              <div className={cn(
                "absolute left-1/2 transform -translate-x-1/2 z-10",
                hasCurvedBanner ? "bottom-0 translate-y-1/2" : "-bottom-12"
              )}>
                <Avatar className={cn("w-24 h-24 border-4 border-white", template.styles.avatarBorder, hasCurvedBanner && "shadow-lg")}>
                  <AvatarImage src={profile.avatar_url || undefined} />
                  <AvatarFallback className={cn(template.styles.cardBg, template.styles.textColor)}>
                    {(profile.display_name || profile.username)?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Content - Spacer for avatar (no background) */}
            <div className="pt-16">
              {/* Inner content container with background */}
              <div 
                className={cn("pb-12 px-4", !hasCustomBackground && template.styles.contentBg)}
              >
              {/* Profile Info */}
              <div className="text-center mb-8 animate-fade-in">
                <p 
                  className={cn(
                    "text-sm mb-1 opacity-70",
                    !(profile as any).title_color && template.styles.textColor
                  )}
                  style={{ 
                    fontFamily: (profile as any).title_font || "Inter",
                    color: (profile as any).title_color || undefined
                  }}
                >
                  @{profile.username}
                </p>
                <h1 
                  className={cn(
                    "font-bold mb-2", 
                    (profile as any).title_size === "small" ? "text-xl" : "text-2xl",
                    !(profile as any).title_color && template.styles.textColor
                  )}
                  style={{
                    fontFamily: (profile as any).title_font || "Inter",
                    color: (profile as any).title_color || undefined
                  }}
                >
                  {profile.display_name || profile.username}
                </h1>
                {profile.bio && (
                  <p 
                    className={cn(
                      "text-sm max-w-xs mx-auto opacity-80",
                      !(profile as any).title_color && template.styles.textColor
                    )}
                    style={{ 
                      fontFamily: (profile as any).title_font || "Inter",
                      color: (profile as any).title_color || undefined
                    }}
                  >
                    {profile.bio}
                  </p>
                )}
              </div>

              {/* Links */}
              <div className="space-y-4">
                {buttons.length === 0 && socials.length === 0 ? (
                  <div className="text-center py-8 animate-fade-in">
                    <p className="text-muted-foreground">
                      Nenhum link disponível ainda.
                    </p>
                  </div>
                ) : (
                  buttons.map((link, index) => (
                    <LinkCard
                      key={link.id}
                      title={link.title}
                      url={link.url}
                      icon={link.icon || undefined}
                      thumbnailUrl={(link as any).thumbnail_url}
                      delay={index * 100}
                      buttonBgColor={profile?.global_button_bg_color || template.styles.primaryColor}
                      buttonTextColor={profile?.global_button_text_color || (template.styles.buttonText?.includes("white") ? "#ffffff" : undefined)}
                      buttonBorderRadius={profile?.global_button_border_radius || undefined}
                      buttonStyle={profile?.global_button_style as "filled" | "outline" || "filled"}
                      fontFamily={(profile as any)?.title_font || "Inter"}
                    />
                  ))
                )}
              </div>

              {/* Social Icons */}
              {socials.length > 0 && (
                <div className="flex justify-center gap-4 flex-wrap mt-6 animate-fade-in">
                  {socials.map((social) => (
                    <a
                      key={social.id}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                      style={{ 
                        backgroundColor: profile?.global_button_bg_color || template.styles.primaryColor,
                        color: profile?.global_button_text_color || (template.styles.buttonText?.includes("white") ? "#ffffff" : undefined)
                      }}
                    >
                      {renderIcon(social.icon || undefined, "w-5 h-5")}
                    </a>
                  ))}
                </div>
              )}

              {/* Footer */}
              <footer className="mt-12 text-center animate-fade-in">
                <button
                  onClick={() => navigate("/auth")}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors glass rounded-full px-4 py-2"
                >
                  <Link2 className="h-4 w-4" />
                  Crie seu Link na Bio
                </button>
              </footer>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Standard Layout
        <div className="container mx-auto px-4 py-12 max-w-md">
          {/* Profile Header */}
          {profile && (
            <ProfileHeader
              displayName={profile.display_name || profile.username}
              username={profile.username}
              bio={profile.bio || undefined}
              avatarUrl={profile.avatar_url || undefined}
              titleFont={(profile as any).title_font || "Inter"}
              titleColor={(profile as any).title_color}
              titleSize={(profile as any).title_size || "large"}
            />
          )}

          {/* Links */}
          <div className="mt-8 space-y-4">
            {buttons.length === 0 && socials.length === 0 ? (
              <div className="text-center py-8 animate-fade-in">
                <p className="text-muted-foreground">
                  Nenhum link disponível ainda.
                </p>
              </div>
            ) : (
              buttons.map((link, index) => (
                <LinkCard
                  key={link.id}
                  title={link.title}
                  url={link.url}
                  icon={link.icon || undefined}
                  thumbnailUrl={(link as any).thumbnail_url}
                  delay={index * 100}
                  buttonBgColor={profile?.global_button_bg_color || template.styles.primaryColor}
                  buttonTextColor={profile?.global_button_text_color || (template.styles.buttonText?.includes("white") ? "#ffffff" : undefined)}
                  buttonBorderRadius={profile?.global_button_border_radius || undefined}
                  buttonStyle={profile?.global_button_style as "filled" | "outline" || "filled"}
                  fontFamily={(profile as any)?.title_font || "Inter"}
                />
              ))
            )}
          </div>

          {/* Social Icons */}
          {socials.length > 0 && (
            <div className="flex justify-center gap-4 flex-wrap mt-6 animate-fade-in">
              {socials.map((social) => (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  style={{ 
                    backgroundColor: profile?.global_button_bg_color || template.styles.primaryColor,
                    color: profile?.global_button_text_color || (template.styles.buttonText?.includes("white") ? "#ffffff" : undefined)
                  }}
                >
                  {renderIcon(social.icon || undefined, "w-5 h-5")}
                </a>
              ))}
            </div>
          )}

          {/* Footer */}
          <footer className="mt-12 text-center animate-fade-in">
            <button
              onClick={() => navigate("/auth")}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors glass rounded-full px-4 py-2"
            >
              <Link2 className="h-4 w-4" />
              Crie seu Link na Bio
            </button>
          </footer>
        </div>
      )}
    </div>
  );
};

export default BioPage;