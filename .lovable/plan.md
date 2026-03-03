
# Plano: Botão de QR Code no Sidebar

## O que será feito

Adicionar um botão "QR Code" no sidebar do painel admin que abre um modal/dialog para gerar e baixar um QR Code da bio page do usuário.

## Mudanças

### 1. Criar componente `QrCodeModal.tsx`
- Modal com dialog que gera um QR Code da URL da página do usuário (usando `buildSubdomainUrl(username)`)
- Usar uma biblioteca de geração de QR Code client-side (canvas-based, sem dependência de API externa)
- Botão para baixar o QR Code como imagem PNG
- Opção de copiar o link da página

### 2. Atualizar `AdminSidebar.tsx`
- Adicionar botão "QR Code" com o ícone `QrCode` do lucide-react na seção de navegação
- Ao clicar, abre o modal de QR Code (estado local no sidebar)

### 3. Dependência
- Instalar `qrcode.react` para renderizar QR Codes como SVG/Canvas no React

## Detalhes técnicos

- O QR Code será gerado localmente no browser usando `qrcode.react`, sem necessidade de API ou backend
- A URL codificada será a mesma usada no botão "Ver minha página" (`buildSubdomainUrl(username)`)
- O botão ficará na seção de navegação do sidebar, após "Configurações" e antes de "Usuários" (admin)
- O download será feito convertendo o canvas/SVG para PNG via `toDataURL`
