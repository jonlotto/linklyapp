

# Plano: QR Code para links personalizados

## O que sera feito

Adicionar a possibilidade de gerar QR Codes a partir de qualquer link digitado pelo usuario, alem do QR Code da bio page que ja existe.

## Mudancas

### Arquivo: `src/components/admin/QrCodeModal.tsx`

1. **Novo campo de input** no topo do modal para digitar/colar um link personalizado
2. **Toggle entre modos**: "Minha pagina" (usa o link da bio) e "Link personalizado" (usa o link digitado)
3. Quando o modo for "Link personalizado":
   - Exibir um input de texto para o usuario colar/digitar a URL
   - O QR Code sera gerado a partir dessa URL em vez do link da bio
   - O texto abaixo do QR mostrara a URL digitada
4. Todos os 4 estilos (Classico, Com Logo, Tematico, Transparente) continuam funcionando normalmente
5. O botao "Copiar link" copiara o link que esta sendo usado (bio ou personalizado)
6. O nome do arquivo no download incluira "custom" quando for link personalizado

### Detalhes tecnicos

- Adicionar estado `mode` (`"bio" | "custom"`) e `customUrl` (string) ao componente
- Usar tabs ou botoes de toggle para alternar entre os modos
- Validar que a URL digitada comeca com `http://` ou `https://` antes de gerar o QR
- O valor passado para `QRCodeCanvas` sera condicional: `mode === "bio" ? bioUrl : customUrl`
- Nenhuma dependencia nova necessaria

