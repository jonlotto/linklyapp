# Migração de banco: cxyzdlwezpftrtkbrskw → tlvnvjtlfxyxfxxaclqq

## Bloqueio encontrado (verificado agora)

O projeto de destino **não está acessível**:

- `tlvnvjtlfxyxfxxaclqq.supabase.co` → **não resolve DNS** (projeto inexistente, deletado ou ainda provisionando).
- Chamada REST no destino retorna código `000` (falha de conexão).
- O projeto de origem `cxyzdlwezpftrtkbrskw` responde normalmente (`200`) e contém os dados.

Além disso, `.env` e `supabase/config.toml` já apontam para `tlvnvjtlfxyxfxxaclqq`, ou seja, o app está configurado para um backend que não existe. Isso explica falhas de login/carregamento na preview.

## Estado atual dos dados na origem (cxyz)

| Tabela | Registros |
|---|---|
| profiles | 7 |
| links | 8 |
| qr_codes | 2 |
| user_roles | 7 |
| push_subscriptions | 0 |

Também existem: bucket de storage `avatars`, 5 funções de banco (`handle_new_user`, `handle_new_user_role`, `has_role`, `get_user_role`, `update_updated_at_column`) e 17 arquivos em `supabase/migrations/`.

## O que precisa acontecer antes de migrar

Uma destas duas coisas:

1. **Confirmar/reativar o projeto destino** — se `tlvnvjtlfxyxfxxaclqq` foi pausado ou está provisionando, ele precisa voltar a responder. Se foi deletado, não há para onde migrar.
2. **Ou fornecer a connection string do destino** (Settings → Database → Connection string) para eu conseguir escrever nele diretamente.

Sem um dos dois, nenhuma escrita no destino é possível.

## Plano de migração (executar quando o destino responder)

### Etapa 1 — Recriar o schema
Aplicar no destino, em ordem, um script consolidado a partir dos 17 arquivos de `supabase/migrations/`:

1. `CREATE TYPE app_role AS ENUM ('admin','moderator','user')`
2. Criar as 5 tabelas com as mesmas colunas, defaults e nullability
3. `GRANT` para `authenticated`, `service_role` e `anon` (onde há política pública)
4. `ENABLE ROW LEVEL SECURITY` + recriar todas as políticas RLS existentes
5. Recriar as 5 funções (`SECURITY DEFINER`, `search_path = public`)
6. Recriar triggers: `on_auth_user_created` (profiles), `on_auth_user_created_role` (user_roles), `update_*_updated_at`
7. Criar o bucket público `avatars` + políticas de storage

### Etapa 2 — Usuários de autenticação
Os IDs em `profiles.user_id`, `links.user_id`, etc. referenciam `auth.users` da origem. Como `auth.users` não pode ser copiado por SQL entre projetos, as opções são:

- **A (recomendada):** exportar os usuários do projeto antigo e importar no novo preservando os UUIDs, para que os dados continuem ligados aos donos corretos.
- **B:** migrar só os dados e pedir que os 7 usuários se cadastrem de novo (perde o vínculo; o trigger `handle_new_user` criaria perfis vazios).

Preciso da sua escolha aqui.

### Etapa 3 — Copiar os dados
Exportar da origem e inserir no destino nesta ordem (respeitando dependências lógicas):
`profiles` → `user_roles` → `links` → `qr_codes` → `push_subscriptions`.

Os triggers `handle_new_user` / `handle_new_user_role` são desativados durante a carga para não duplicar registros, e reativados ao final.

### Etapa 4 — Arquivos de storage
Baixar os objetos do bucket `avatars` da origem e reenviar no destino, mantendo os mesmos caminhos. Depois, verificar se as `avatar_url` / `banner_url` gravadas em `profiles` apontam para o domínio antigo — se sim, atualizar as URLs para o novo projeto.

### Etapa 5 — Edge functions e segredos
Reimplantar `send-push`. Segredos como VAPID / OneSignal precisam ser recadastrados no novo projeto (não são copiáveis).

### Etapa 6 — Validação
- Conferir contagem de linhas tabela a tabela (7 / 8 / 2 / 7 / 0)
- Testar login, carregamento do editor e uma página pública
- Rodar o linter de segurança do banco no destino

## Detalhes técnicos

- Exportação da origem via `psql` COPY para CSV, importação no destino via inserts em lote.
- Nenhum `pg_dump` completo — apenas exportações por tabela.
- URLs de storage em `profiles.avatar_url`, `profiles.banner_url`, `profiles.global_background_image` e `links.thumbnail_url` são reescritas para o novo ref de projeto.
- `.env` e `supabase/config.toml` já apontam para o destino; nenhuma mudança de código do app é necessária.

## Próximo passo

Me confirme se o projeto `tlvnvjtlfxyxfxxaclqq` ainda existe (e reative/despause), ou me passe a connection string dele. Também escolha entre a opção **A** ou **B** da Etapa 2.
