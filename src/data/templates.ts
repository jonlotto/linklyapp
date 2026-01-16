export interface Template {
  id: string;
  name: string;
  slug: string;
  description: string;
  styles: {
    background: string;
    cardBg: string;
    textColor: string;
    buttonStyle: string;
    buttonBg: string;
    buttonText: string;
    avatarBorder: string;
  };
}

export const templates: Template[] = [
  {
    id: "natural",
    name: "Natural",
    slug: "natural",
    description: "Tons verdes e terrosos com visual orgânico",
    styles: {
      background: "bg-gradient-to-br from-emerald-800 via-green-700 to-teal-800",
      cardBg: "bg-white/10 backdrop-blur-sm",
      textColor: "text-white",
      buttonStyle: "rounded-full",
      buttonBg: "bg-gray-200 hover:bg-gray-300",
      buttonText: "text-gray-800",
      avatarBorder: "ring-4 ring-white/30",
    },
  },
  {
    id: "clean",
    name: "Clean",
    slug: "clean",
    description: "Minimalista e elegante com tons claros",
    styles: {
      background: "bg-gradient-to-br from-slate-100 via-gray-50 to-stone-100",
      cardBg: "bg-white/80 backdrop-blur-sm",
      textColor: "text-gray-800",
      buttonStyle: "rounded-xl",
      buttonBg: "bg-white hover:bg-gray-50 shadow-md",
      buttonText: "text-gray-700",
      avatarBorder: "ring-4 ring-gray-200",
    },
  },
  {
    id: "bold",
    name: "Bold",
    slug: "bold",
    description: "Escuro e vibrante com cores coral",
    styles: {
      background: "bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900",
      cardBg: "bg-white/5 backdrop-blur-sm",
      textColor: "text-white",
      buttonStyle: "rounded-2xl",
      buttonBg: "bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600",
      buttonText: "text-white",
      avatarBorder: "ring-4 ring-orange-400/50",
    },
  },
  {
    id: "starter",
    name: "Do Zero",
    slug: "starter",
    description: "Comece com o básico e personalize tudo",
    styles: {
      background: "bg-gradient-to-br from-primary/20 via-background to-accent/20",
      cardBg: "bg-card/80 backdrop-blur-sm",
      textColor: "text-foreground",
      buttonStyle: "rounded-xl",
      buttonBg: "bg-primary hover:bg-primary/90",
      buttonText: "text-primary-foreground",
      avatarBorder: "ring-4 ring-primary/30",
    },
  },
];
