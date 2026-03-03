
# Plano: Corrigir botao "Gerar" e salvar QR Codes

## Problemas identificados

1. **Botao "Gerar" pode parecer nao funcionar**: A validacao exige que o link comece com `http://` ou `https://`. Se o usuario digitar apenas `exemplo.com`, o botao fica desabilitado sem feedback claro.
2. **QR Codes nao sao salvos**: Atualmente tudo e apenas em memoria -- ao fechar o modal, perde-se o QR Code gerado.

## Solucao

### 1. Melhorar UX do botao "Gerar"
- Auto-adicionar `https://` quando o usuario digitar um link sem protocolo (ex: `exemplo.com` vira `https://exemplo.com`)
- Mostrar feedback visual claro quando o link e invalido
- Garantir que o botao nao fique desabilitado desnecessariamente

### 2. Criar tabela para salvar QR Codes gerados
- Nova tabela `qr_codes` no banco de dados com colunas:
  - `id` (uuid, chave primaria)
  - `user_id` (uuid, referencia ao usuario)
  - `url` (text, o link usado para gerar o QR)
  - `label` (text, nome opcional para identificar)
  - `style` (text, estilo escolhido: classic/logo/branded/transparent)
  - `created_at` (timestamp)
- RLS para que cada usuario so veja seus proprios QR Codes

### 3. Atualizar o modal QrCodeModal
- Ao clicar "Gerar", salvar o QR Code no banco de dados
- Exibir lista de QR Codes salvos anteriormente no modal (ou em secao separada)
- Permitir deletar QR Codes salvos
- Carregar QR Codes salvos ao abrir o modal

### Detalhes tecnicos

**Migracao SQL:**
```sql
create table public.qr_codes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  url text not null,
  label text,
  style text default 'logo',
  created_at timestamptz default now()
);

alter table public.qr_codes enable row level security;

create policy "Users can view own qr codes" on public.qr_codes
  for select to authenticated using (auth.uid() = user_id);

create policy "Users can insert own qr codes" on public.qr_codes
  for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can delete own qr codes" on public.qr_codes
  for delete to authenticated using (auth.uid() = user_id);
```

**Arquivo `src/components/admin/QrCodeModal.tsx`:**
- Importar `supabase` e `useAuth`
- Buscar QR codes salvos com `useQuery`
- Ao clicar "Gerar": salvar no banco e atualizar a lista
- Auto-prefixar URLs sem protocolo com `https://`
- Exibir lista de QR codes salvos com opcao de selecionar ou deletar

**Fluxo do usuario:**
1. Abre o modal e ve seus QR Codes salvos (se houver)
2. Clica em "Link personalizado"
3. Digita `exemplo.com` -> automaticamente vira `https://exemplo.com`
4. Clica "Gerar" -> QR Code aparece E e salvo no banco
5. Na proxima vez que abrir, o QR Code estara la
