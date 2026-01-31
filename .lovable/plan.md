
## Plano: Transformar BioBR em PWA com Notificações Push

### O que é PWA?
Um Progressive Web App permite que seu app seja instalado na tela inicial do celular como um app nativo, funcione offline e receba notificações push.

---

### Parte 1: Configuração Básica do PWA

#### 1.1 Instalar dependência
```bash
npm install vite-plugin-pwa -D
```

#### 1.2 Atualizar `vite.config.ts`
Adicionar o plugin PWA com configuração do manifest:

```typescript
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => ({
  // ... config existente
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt'],
      manifest: {
        name: 'BioBR - Seus links em um só lugar',
        short_name: 'BioBR',
        description: 'Tenha seus links em um só lugar!',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}']
      }
    }),
    mode === "development" && componentTagger()
  ].filter(Boolean),
}));
```

#### 1.3 Criar ícones PWA
Criar arquivos em `public/`:
- `pwa-192x192.png` - Ícone 192x192 pixels
- `pwa-512x512.png` - Ícone 512x512 pixels

#### 1.4 Atualizar `index.html`
Adicionar meta tags para PWA no `<head>`:

```html
<!-- PWA -->
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#000000">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="BioBR">
<link rel="apple-touch-icon" href="/pwa-192x192.png">
```

---

### Parte 2: Notificações Push

#### 2.1 Criar tabela no banco para tokens
Armazenar os tokens de push notification dos dispositivos:

```sql
CREATE TABLE push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, endpoint)
);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own subscriptions"
ON push_subscriptions FOR ALL
USING (auth.uid() = user_id);
```

#### 2.2 Criar hook `usePushNotifications`
Hook para gerenciar permissão e registro de push:

```typescript
// src/hooks/usePushNotifications.ts
export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Solicitar permissão
  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') {
      await subscribeUser();
    }
    return result;
  };

  // Registrar subscription no banco
  const subscribeUser = async () => {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: VAPID_PUBLIC_KEY
    });
    
    // Salvar no Supabase
    await supabase.from('push_subscriptions').upsert({
      user_id: userId,
      endpoint: subscription.endpoint,
      p256dh: subscription.toJSON().keys.p256dh,
      auth: subscription.toJSON().keys.auth
    });
  };

  return { permission, isSubscribed, requestPermission };
}
```

#### 2.3 Criar Edge Function para enviar notificações
Backend para disparar push notifications:

```typescript
// supabase/functions/send-push/index.ts
import webpush from 'web-push';

webpush.setVapidDetails(
  'mailto:contato@biobr.site',
  Deno.env.get('VAPID_PUBLIC_KEY'),
  Deno.env.get('VAPID_PRIVATE_KEY')
);

Deno.serve(async (req) => {
  const { userId, title, body, url } = await req.json();
  
  // Buscar subscriptions do usuário
  const { data: subscriptions } = await supabase
    .from('push_subscriptions')
    .select('*')
    .eq('user_id', userId);
  
  // Enviar para cada dispositivo
  for (const sub of subscriptions) {
    await webpush.sendNotification(
      { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth }},
      JSON.stringify({ title, body, url })
    );
  }
  
  return new Response(JSON.stringify({ success: true }));
});
```

#### 2.4 Configurar Service Worker para receber push
O `vite-plugin-pwa` gerará o SW automaticamente, mas precisamos adicionar handler de push:

```typescript
// src/sw-custom.ts (injetado no SW)
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/pwa-192x192.png',
      badge: '/pwa-192x192.png',
      data: { url: data.url }
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url || '/')
  );
});
```

---

### Parte 3: Interface do Usuário

#### 3.1 Componente de instalação PWA
Banner/botão para incentivar instalação:

```typescript
// src/components/InstallPWA.tsx
export function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const handleInstall = async () => {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  if (!deferredPrompt) return null;

  return (
    <Button onClick={handleInstall}>
      Instalar App
    </Button>
  );
}
```

#### 3.2 Toggle de notificações nas configurações
Adicionar opção no admin para ativar/desativar:

```typescript
// No ConfigTab.tsx ou novo NotificationsSection
<Switch 
  checked={pushEnabled}
  onCheckedChange={handleTogglePush}
/>
<span>Receber notificações</span>
```

---

### Arquivos a Criar/Modificar

| Arquivo | Ação |
|---------|------|
| `vite.config.ts` | Modificar - adicionar VitePWA |
| `index.html` | Modificar - meta tags PWA |
| `public/pwa-192x192.png` | Criar - ícone pequeno |
| `public/pwa-512x512.png` | Criar - ícone grande |
| `src/hooks/usePushNotifications.ts` | Criar - hook de push |
| `src/components/InstallPWA.tsx` | Criar - botão de instalação |
| `supabase/functions/send-push/index.ts` | Criar - edge function |
| Migração SQL | Criar - tabela push_subscriptions |

---

### Secrets Necessários

Para notificações push funcionarem, será necessário gerar e configurar:
- `VAPID_PUBLIC_KEY` - Chave pública (pode ficar no código)
- `VAPID_PRIVATE_KEY` - Chave privada (secret no Supabase)

Posso gerar essas chaves automaticamente durante a implementação.

---

### Resultado Final

1. Usuários podem instalar o BioBR na tela inicial do celular
2. App funciona offline (cache de assets)
3. Notificações push para engajar usuários (ex: "Seu perfil teve 10 visitas hoje!")
4. Experiência similar a app nativo
