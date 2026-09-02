# Acesso ao painel do banco e situação do backend

## Resposta direta

Este projeto roda no **Lovable Cloud** — que já é um backend Supabase completo, provisionado e gerenciado pelo Lovable. Não dá para "trocar" por um projeto Supabase próprio mantendo os dados: o app fica sempre ligado ao backend do Cloud.

Para gerenciar o banco você usa a aba **Cloud** dentro do Lovable (tabelas, usuários, logs, funções, storage, segredos). O painel do supabase.com não é acessível para projetos Cloud.

Se você realmente quiser sair do Cloud, um admin do workspace pode fazer isso em **Cloud → Advanced → Disconnect**. Atenção: é **irreversível e apaga permanentemente** banco, storage e funções — por isso o passo de exportar os dados vem antes.

## O que verifiquei agora

- `.env` e `supabase/config.toml` apontam para `tlvnvjtlfxyxfxxaclqq`, mas esse host **não resolve DNS** — projeto inexistente ou inacessível.
- O backend real e saudável é `cxyzdlwezpftrtkbrskw`, que responde normalmente e contém seus dados.

Dados presentes hoje:

| Tabela | Registros |
|---|---|
| profiles | 7 |
| links | 8 |
| qr_codes | 2 |
| user_roles | 7 |
| push_subscriptions | 0 |

Mais: bucket público `avatars`, 5 funções de banco, 17 migrations em `supabase/migrations/`, edge function `send-push`.

## Plano proposto

### Etapa 1 — Corrigir o apontamento do backend
Confirmar que `.env` e `supabase/config.toml` voltam a apontar para o projeto Cloud ativo. Enquanto apontarem para um host inexistente, login e carregamento de dados falham na preview e no publicado. Esses arquivos são gerenciados pela integração, então a correção é feita revalidando a conexão do Cloud, não editando à mão.

### Etapa 2 — Gerar um pacote de exportação completo
Para você ter os dados em mãos independentemente do painel:

- CSV de cada tabela (`profiles`, `links`, `qr_codes`, `user_roles`, `push_subscriptions`)
- Um `schema.sql` consolidado: enum `app_role`, as 5 tabelas com defaults e nullability, GRANTs, RLS + todas as políticas, as 5 funções (`handle_new_user`, `handle_new_user_role`, `has_role`, `get_user_role`, `update_updated_at_column`) e os triggers
- Lista dos objetos do bucket `avatars`

Tudo entregue como arquivos baixáveis. Esse pacote é suficiente para recriar o banco em qualquer Supabase próprio no futuro.

### Etapa 3 — Validar o app
Após corrigir o apontamento: testar login, editor e uma página pública, e rodar o linter de segurança do banco.

## Detalhes técnicos

- Exportação por tabela via `psql` COPY para CSV (sem dump completo).
- `auth.users` não é exportável por SQL entre projetos; se um dia migrar para Supabase próprio, os usuários precisam ser exportados pelo painel de destino preservando os UUIDs, senão o vínculo com `profiles.user_id` quebra.
- URLs em `profiles.avatar_url`, `profiles.banner_url`, `profiles.global_background_image` e `links.thumbnail_url` embutem o ref do projeto atual e precisariam ser reescritas numa migração futura.
- Nenhuma alteração de código do app é necessária.

## Decisão sua

Quer que eu siga com a Etapa 1 + 2 (corrigir apontamento e gerar o pacote de exportação), ou só a exportação?
