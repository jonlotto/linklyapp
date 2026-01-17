import { EditorProfile } from "@/hooks/useEditorState";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface TextSectionProps {
  profile: EditorProfile;
  onUpdate: (updates: Partial<EditorProfile>) => void;
}

export function TextSection({ profile, onUpdate }: TextSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Texto</h3>
        <p className="text-sm text-muted-foreground">
          Edite as informações do seu perfil
        </p>
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <Label htmlFor="displayName">Nome de exibição</Label>
        <Input
          id="displayName"
          value={profile.displayName}
          onChange={(e) => onUpdate({ displayName: e.target.value })}
          placeholder="Seu nome"
        />
      </div>

      {/* Username */}
      <div className="space-y-2">
        <Label htmlFor="username">Nome de usuário</Label>
        <div className="flex items-center">
          <span className="px-3 py-2 bg-muted rounded-l-lg border border-r-0 border-border text-muted-foreground text-sm">
            linklyapp.lovable.app/
          </span>
          <Input
            id="username"
            value={profile.username}
            onChange={(e) => onUpdate({ username: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, "") })}
            placeholder="usuario"
            className="rounded-l-none"
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Apenas letras minúsculas, números, hífen e underscore
        </p>
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          value={profile.bio}
          onChange={(e) => onUpdate({ bio: e.target.value })}
          placeholder="Uma breve descrição sobre você..."
          rows={3}
        />
        <p className="text-xs text-muted-foreground">
          {profile.bio.length}/150 caracteres
        </p>
      </div>
    </div>
  );
}
