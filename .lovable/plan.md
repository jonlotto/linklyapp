
# Plano: Corrigir atualização do PWA e erro do OneSignal

## Problemas Identificados

1. **OneSignal restrito ao domínio**: O SDK só funciona em `https://biobr.site`, não no preview
2. **Cache do Service Worker**: O PWA está mostrando versão antiga mesmo com `autoUpdate`

## Solução

### 1. Melhorar tratamento de erro do OneSignal
**Arquivo:** `src/hooks/useOneSignal.ts`

Capturar o erro de domínio inválido e definir estados corretos:
- Quando erro "Can only be used on", marcar `isSupported = false` com mensagem amigável
- Evitar que o componente quebre ou mostre estado incorreto

### 2. Forçar atualização do Service Worker
**Arquivo:** `vite.config.ts`

Alterar configuração do Workbox para forçar atualização imediata:
```typescript
workbox: {
  // Forçar novo SW a tomar controle imediatamente
  skipWaiting: true,
  clientsClaim: true,
  // ... resto das configurações
}
```

### 3. Adicionar componente de atualização manual
**Arquivo:** `src/components/PWAUpdatePrompt.tsx` (novo)

Criar componente que detecta quando há nova versão e oferece botão para atualizar:
- Usa hook `useRegisterSW` do vite-plugin-pwa
- Mostra toast quando há atualização disponível
- Permite o usuário forçar reload

### 4. Integrar prompt de atualização
**Arquivo:** `src/App.tsx`

Adicionar o `PWAUpdatePrompt` no App para funcionar globalmente

## Detalhes Técnicos

**useOneSignal.ts - Tratamento de erro:**
```typescript
catch (error: any) {
  // Verificar se é erro de domínio
  if (error?.message?.includes("Can only be used on")) {
    console.log("[OneSignal] Domain restriction - running on:", window.location.hostname);
    // Em desenvolvimento/preview, marcar como não suportado gracefully
    setIsSupported(false);
  } else {
    console.error("OneSignal initialization error:", error);
  }
}
```

**PWAUpdatePrompt.tsx:**
```typescript
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from "sonner";

export function PWAUpdatePrompt() {
  const {
    needRefresh: [needRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  useEffect(() => {
    if (needRefresh) {
      toast("Nova versão disponível!", {
        action: {
          label: "Atualizar",
          onClick: () => updateServiceWorker(true),
        },
        duration: Infinity,
      });
    }
  }, [needRefresh]);

  return null;
}
```

## Resultado Esperado
- PWA atualizará automaticamente ou mostrará prompt
- Seção "Configurações" aparecerá após atualização
- Notificações funcionarão apenas no domínio de produção (biobr.site)
- Preview mostrará mensagem amigável em vez de erro
