

# Plano: QR Code com moldura de cantos (scan frame)

## O que sera feito

Atualizar o modal de QR Code para exibir o QR Code com uma moldura decorativa de cantos (corner brackets), similar ao estilo da imagem de referencia - um visual de "scanner" com cantos destacados ao redor do QR Code, fundo escuro.

## Mudancas

### Arquivo: `src/components/admin/QrCodeModal.tsx`

- Substituir o container branco simples do QR Code por um design com **corner brackets decorativos** usando CSS (pseudo-elementos ou bordas parciais)
- Manter fundo escuro ao redor, com o QR Code em branco no centro
- Os 4 cantos terao linhas grossas formando "L" invertidos, criando o efeito de moldura de scanner
- O QR Code continuara funcional para download e leitura

### Detalhes tecnicos

A moldura sera feita com 4 elementos `div` posicionados nos cantos usando `absolute positioning`, cada um com bordas parciais (ex: `border-top + border-left` para o canto superior esquerdo). Isso cria o efeito visual sem interferir no QR Code canvas.

```text
+--                    --+
|                        |
|      [QR CODE]         |
|                        |
+--                    --+
```

Nenhuma dependencia nova sera necessaria.

