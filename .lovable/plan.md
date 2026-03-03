

# Plano: Adicionar estilo "Transparente" ao QR Code

## O que sera feito

Adicionar um 4o estilo de QR Code ao modal com fundo transparente e cor branca, similar a imagem de referencia enviada anteriormente.

## Mudancas

### Arquivo: `src/components/admin/QrCodeModal.tsx`

1. **Novo estilo no array `STYLES`**: Adicionar `"transparent"` com label "Transparente" e descricao "Fundo transparente, QR branco"

2. **Logica de cores**:
   - `fgColor`: branco (`#ffffff`) quando estilo for `transparent`
   - `bgColor`: transparente (`transparent` ou `rgba(0,0,0,0)`) quando estilo for `transparent`
   - `cornerColor`: branco para manter os cantos visiveis

3. **Container do QR Code**:
   - Quando o estilo for `transparent`, remover o fundo branco (`bg-white`) do container interno e usar fundo escuro/transparente
   - O canvas tera fundo transparente, entao o QR branco sera visivel contra o fundo escuro do modal

4. **Download**:
   - O PNG baixado tera fundo transparente (o canvas ja suporta isso nativamente com `bgColor` transparente)

### Detalhes tecnicos

- `QRCodeCanvas` suporta `bgColor` com valores como `"transparent"` ou `"rgba(0,0,0,0)"`
- O container interno (`div` com `bg-white`) sera condicional: `bg-white` para outros estilos, `bg-transparent` para o estilo transparente
- O logo BioBR nao sera exibido neste estilo (ficaria ilegivel em branco sobre transparente)

