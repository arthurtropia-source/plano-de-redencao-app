# CLAUDE.md — Plano de Redenção App

## Regras invioláveis

- **Este app é apenas leitura.** Nenhum input do usuário. Nenhum login. Nenhum admin UI.
- **Todo conteúdo visível na tela vem exclusivamente do material do Pr. Ricardo e da Tia Mônica.** Nunca completar, inferir ou adicionar conteúdo de conhecimento próprio.
- **Toda alteração no JSON deve manter o campo `_fonte` correspondente.** Adicionar conteúdo sem fonte é um anti-padrão crítico deste projeto.

## Arquitetura

- `public/data/timeline.json` — fonte única de verdade para todo conteúdo
- `src/styles/v3-classes.css` — classes CSS extraídas do v3; não reescrever em Tailwind
- `src/App.jsx` — todos os componentes em arquivo único (LinhaHorizontal, LinhaVertical, PainelDetalhe, BotoesFlutuantes)
- Conteúdo dos painéis renderizado via `dangerouslySetInnerHTML` — seguro porque o JSON é editado exclusivamente via Claude

## Como editar conteúdo

1. Abrir `public/data/timeline.json`
2. Localizar a estação pelo campo `id`
3. Editar `resumido_html` ou `detalhado_html` mantendo as classes CSS do v3
4. Atualizar o `_fonte` correspondente com arquivo + localização + autor
5. Commit + push → Vercel atualiza automaticamente

## Restrições técnicas críticas

- **NÃO trocar `orientation: "any"` no manifest** → quebra o modo Detalhado no landscape
- **NÃO adicionar react-router-dom** → v1 é single-page
- **NÃO usar localStorage** → app não tem estado persistente do usuário
- **NÃO instalar Recharts** → sem séries temporais neste projeto

## Escopo v1

Apenas as 14 estações da linha do tempo do Plano de Redenção. Outras topologias (Linhagens de Adão, Reis de Israel, Cristologia nos 4 Evangelhos, Reforma e 5 Solas) ficam para v2.

## Referência visual

`plano-redencao-v3.html` (fora do repositório, na pasta do projeto) é o alvo visual. Para qualquer dúvida de "como deve ficar", abrir o v3.
