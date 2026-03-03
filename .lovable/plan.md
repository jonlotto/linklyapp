

# Plano: Adicionar logo personalizada no centro do QR Code

## O que sera feito

Substituir/adicionar a imagem enviada (logo azul "V") como opcao de logo no centro do QR Code, usada nos estilos "Com Logo" e "Tematico".

## Mudancas

### 1. Copiar a imagem para o projeto
- Copiar `user-uploads://FT005.png` para `src/assets/ft005-logo.png`

### 2. Arquivo: `src/components/admin/QrCodeModal.tsx`
- Importar a nova imagem: `import customLogo from "@/assets/ft005-logo.png"`
- Atualizar o `imageSettings` do `QRCodeCanvas` para usar `customLogo` em vez de `bioBrLogo` nos estilos que exibem logo ("logo" e "branded")
- Manter toda a logica existente (excavate, tamanho 40x40, etc.)

### Detalhes tecnicos
- A prop `imageSettings.src` do `QRCodeCanvas` aceita qualquer caminho de imagem importado
- O `excavate: true` ja esta configurado, garantindo que o logo nao sobreponha os padroes do QR
- Nenhuma dependencia nova necessaria

