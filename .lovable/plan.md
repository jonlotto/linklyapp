
# Plano: Adicionar seção de Configurações com Notificações

## Objetivo
Adicionar uma nova seção "Configurações" no menu lateral da página de Design com opções de notificações push.

## Alterações

### 1. Criar componente SettingsSection
**Arquivo:** `src/components/design/sections/SettingsSection.tsx`

Novo componente seguindo o padrão das outras seções (ButtonsSection, HeaderSection, etc.):
- Título "Configurações" com descrição
- Card de notificações usando o componente `NotificationPermission` já existente
- Estilo visual consistente com as outras seções

### 2. Atualizar DesignSidebar
**Arquivo:** `src/components/design/DesignSidebar.tsx`

- Adicionar nova entrada no array `SECTIONS`:
  - `id: "settings"`
  - `label: "Configurações"` 
  - `icon: Settings` (do lucide-react)

### 3. Atualizar página Design
**Arquivo:** `src/pages/Design.tsx`

- Importar o novo `SettingsSection`
- Adicionar nova `<section id="settings">` após a seção de botões

## Estrutura Visual
```text
Menu Lateral          |  Área Principal
----------------------|------------------
Header                |  [seções existentes]
Tema                  |  
Fundo                 |  
Texto                 |  
Botões                |  
Configurações (NOVO)  |  [card de notificações]
```

## Detalhes Técnicos

**SettingsSection.tsx:**
```typescript
- Importa NotificationPermission do componente existente
- Usa variant="card" para exibir o toggle de notificações
- Segue o mesmo padrão de layout das outras seções
```

**Integração com scroll spy:**
- A seção terá `id="settings"` e classe `scroll-mt-20`
- O scroll spy já funciona automaticamente com o array SECTION_IDS
