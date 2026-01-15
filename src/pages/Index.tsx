import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Link2, ArrowRight, Sparkles, Zap, Shield } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-bg overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent/30 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 py-12 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-card shadow-glow">
              <Link2 className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display font-bold text-xl">Link na Bio</span>
          </div>

          <Button
            onClick={() => navigate("/auth")}
            variant="outline"
            className="rounded-full glass border-none"
          >
            Entrar
          </Button>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center text-center py-16">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Simples, rápido e elegante</span>
            </div>

            <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Todos os seus links
              <br />
              <span className="text-gradient">em um só lugar</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              Crie sua página de links personalizada para Instagram, TikTok, 
              YouTube e todas as suas redes sociais. Grátis e em segundos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                onClick={() => navigate("/auth")}
                size="lg"
                className="rounded-full px-8 h-14 text-lg bg-primary hover:bg-primary/90 shadow-glow-lg transition-all duration-300 hover:scale-105"
              >
                Criar meu link grátis
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
              
              <Button
                onClick={() => navigate("/demo")}
                variant="ghost"
                size="lg"
                className="rounded-full px-8 h-14 text-lg"
              >
                Ver exemplo
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full animate-slide-up opacity-0" style={{ animationDelay: "300ms" }}>
            <div className="glass-strong rounded-3xl p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-bold mb-2">Super Rápido</h3>
              <p className="text-sm text-muted-foreground">
                Configure sua página em menos de 1 minuto
              </p>
            </div>

            <div className="glass-strong rounded-3xl p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-bold mb-2">Personalizável</h3>
              <p className="text-sm text-muted-foreground">
                Adicione quantos links quiser com emojis
              </p>
            </div>

            <div className="glass-strong rounded-3xl p-6 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mx-auto mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display font-bold mb-2">Seguro</h3>
              <p className="text-sm text-muted-foreground">
                Seus dados protegidos e privados
              </p>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-sm text-muted-foreground">
          <p>Feito com ❤️ para criadores de conteúdo</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
