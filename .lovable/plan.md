
## Escopo (tudo de uma vez)

### 1. Cabeçalho totalmente editável
Nova aba **"Cabeçalho"** em `/admin`:
- Cor de fundo do topo (independente do tema)
- Cor do texto dos links
- Rótulos editáveis de cada link do menu (Início, Institucional, Especialidades, Mídia, Podcast, Contato, Instagram)
- Troca de logo (já existe em Marca, mantido)

### 2. Quadro de eventos no Hero (até 5)
- Nova tabela `events` (imagem de capa, título, data, texto/notícia, link opcional, ordem, publicado)
- Nova aba **"Eventos"** no /admin (upload de capa, editor de texto, on/off)
- No hero (lado direito, substituindo o espaço vazio marcado em amarelo): carrossel com auto-rolagem, cards com capa + título. Clique abre modal com a notícia completa.
- Limite de 5 eventos ativos ao mesmo tempo.

### 3. Direção & Coordenação com foto + currículo
- Nova tabela `team_members` (nome, cargo, foto, biografia, ordem, publicado)
- Substitui o array atual `institutional.leadership` (migração dos 4 nomes existentes)
- Nova aba **"Equipe"** no /admin (upload de foto, biografia, adicionar/remover ilimitado)
- Na página Institucional: cards com foto circular; clique abre modal com foto grande + cargo + biografia.

### 4. Profissionais por Especialidade
- Nova tabela `professionals` (nome, cargo/título, foto opcional, biografia, `specialty_id` FK, ordem, publicado)
- Nova aba **"Profissionais"** no /admin (dropdown de especialidade + lista de profissionais vinculados)
- Nos cards de especialidade: lista de nomes abaixo do título; clique no nome abre modal com currículo.
- Botão "Adicionar mais cards" já existente na aba de Especialidades (mantido).

### 5. Mídia — vídeos e álbuns de fotos
- **Vídeos:** revisar (já mostra thumb do YouTube; validar renderização e corrigir se necessário)
- **Álbuns de fotos:**
  - Nova tabela `photo_albums` (nome, descrição, capa, ordem, publicado)
  - Coluna `album_id` em `media_items` (nullable, só para fotos)
  - Nova aba **"Álbuns"** no /admin: criar álbum, upload em lote (múltiplas fotos de uma vez), limite visual de 12 por álbum
  - Na página /midia: substituir grade única por lista de álbuns (card com capa + nome + contagem); clique abre modal/lightbox com as fotos do álbum.

## Arquivos a criar/editar

**Migrations (uma só, em ordem):**
- `events` + GRANTs + RLS + policies (public read publicado, admin all)
- `team_members` + GRANTs + RLS + policies
- `professionals` + GRANTs + RLS + policies
- `photo_albums` + GRANTs + RLS + policies
- `ALTER media_items ADD COLUMN album_id UUID REFERENCES photo_albums`
- Seed dos 4 team_members atuais a partir do JSON existente
- Novo `site_content` key `header` (cores + rótulos)

**Código:**
- `src/lib/content.ts`: novos hooks `useHeaderContent`, `useEvents`, `useTeamMembers`, `useProfessionals`, `usePhotoAlbums`
- `src/components/SiteLayout.tsx`: aplicar cores/rótulos do header dinâmicos
- `src/routes/index.tsx`: adicionar coluna de eventos no hero + modal
- `src/routes/sobre.tsx`: nova grade de equipe com modal de currículo
- `src/routes/especialidades.tsx`: nomes de profissionais em cada card + modal
- `src/routes/midia.tsx`: reorganizar fotos por álbum com lightbox; validar vídeos
- `src/routes/_authenticated/admin.tsx`: adicionar 4 novas abas (Cabeçalho, Eventos, Equipe, Profissionais, Álbuns)

## Ordem de entrega
1. Migração única (aprovação sua)
2. Depois da migração aplicada: todo o código de UI (site público + admin) em uma leva

Confirma que posso rodar a migração?
