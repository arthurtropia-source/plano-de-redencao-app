# Esquema de catalogação — Provérbios (Bíblia de Estudo Holman / BKJ Fiel 1611)

> **Fonte estruturada, NÃO servida ao app.** Igual a `data-source/timeline.json`:
> é o catálogo *lossless* dos dados. A visualização (tema CSS + aula servida em
> `public/data/courses/`) é uma derivação **posterior** e fora do escopo da
> catalogação.

## Regras invioláveis (deste projeto + desta catalogação)

1. **Só entra o que está na foto.** Nada é inferido, completado ou adicionado de
   conhecimento próprio. Se a foto está ilegível/cortada, o campo fica vazio e
   registra-se a pendência — nunca se "preenche de cabeça".
2. **Texto verbatim.** Versículos, notas e estudos de palavra são transcritos
   exatamente como impressos, **preservando abreviações** ("Heb.", "Gr.",
   "Aram.", "lit.", "cp.", "TM", "LXX", "v.", etc. — ver `abreviacoes[]` em
   `_livro.json`). Não expandir abreviações dentro do `texto`.
3. **Todo registro carrega `_fonte`.** Sem `_fonte`, o registro é inválido.

## Origem dos dados

A Bíblia de Estudo Holman organiza cada página em 12 ferramentas ao redor do
texto sagrado. Para Provérbios, catalogamos:

| Ferramenta Holman | Onde vai no catálogo |
|---|---|
| Texto das Escrituras (+ pilcrow ¶, palavras em vermelho) | `versiculos[]` |
| Notas de estudo (rodapé, indexadas por versículo/faixa) | `notas_estudo[]` |
| Notas textuais / traduções do original (heb./gr./aram.) | `versiculos[].notas_textuais[]` |
| Referências cruzadas (coluna, por versículo) | `referencias_cruzadas[]` |
| Estudos de palavras (box com original/pronúncia/ocorrências) | `estudos_palavra[]` |
| Mapas, Quadros, Ilustrações, Fotos | `recursos_visuais[]` |
| Introdução do livro (autor, contexto, mensagem, estrutura) | `_livro.json → introducao` |
| Cronologia (eventos bíblicos/mundiais por faixa de datas) | `_livro.json → cronologia[]` |
| Artigos (texto temático assinado) | `_livro.json → artigos[]` |

## Arquivos

```
_livro.json     # nível-livro: introducao, cronologia[], artigos[], abreviacoes[], capitulos[]
cap-NN.json     # um por capítulo (cap-01.json ... cap-31.json)
ESQUEMA.md      # este arquivo
```

## Formato de `_fonte`

Segue o padrão do projeto (`{ arquivo, autor, localizacao }`):

```json
{
  "arquivo": "BKJ Fiel 1611 com Estudo Holman — Provérbios",
  "autor": "Editores Holman / BV Books",
  "localizacao": "p. 0000 · foto enviada 2026-00-00 · v. 1:7"
}
```

- `autor`: "Editores Holman / BV Books" para texto/notas/refs; **nome do autor**
  quando for artigo assinado (ex.: "Craig Blaising").
- `localizacao`: página impressa + identificação da foto + referência (versículo
  ou faixa) — o suficiente para reencontrar a origem.

## Schema — `_livro.json`

```jsonc
{
  "versao": "1.0",
  "ultima_atualizacao": "AAAA-MM-DD",
  "historico_mudancas": [ { "data": "...", "descricao": "...", "autor": "..." } ],
  "livro": "Provérbios",
  "introducao": {
    "autor": "",                 // texto verbatim da seção "Autor"
    "contexto_historico": "",
    "mensagem_proposito": "",
    "contribuicao_biblia": "",
    "estrutura_esboco": "",
    "_fonte": { }
  },
  "cronologia": [
    { "faixa": "", "eventos": [ { "tipo": "biblico|mundial", "data": "", "texto": "" } ], "_fonte": { } }
  ],
  "artigos": [
    { "id": "", "titulo": "", "autor": "", "corpo": "", "_fonte": { } }
  ],
  "abreviacoes": [ { "sigla": "Heb.", "significado": "Hebraico" } ],
  "capitulos": [ { "numero": 1, "arquivo": "cap-01.json" } ]
}
```

## Schema — `cap-NN.json`

```jsonc
{
  "livro": "Provérbios",
  "capitulo": 1,
  "_fonte_pagina": [ "p. 0000 · foto enviada AAAA-MM-DD" ],

  "versiculos": [
    {
      "ref": "1:1",
      "numero": 1,
      "inicia_paragrafo": false,        // true se houver pilcrow (¶) iniciando o parágrafo
      "texto": "",                      // VERBATIM
      "palavras_vermelho": [],          // trechos em vermelho (palavras de Deus), se houver
      "notas_textuais": [               // marcadores de nota no texto → tradução/original
        {
          "ancora": "",                 // palavra/expressão do versículo a que a nota se refere
          "idioma": "heb",              // heb | gr | aram (ou "" se não indicado)
          "tipo": "traducao",           // traducao | variante | literal
          "texto": "",                  // VERBATIM (com abreviações)
          "_fonte": { }
        }
      ],
      "_fonte": { }
    }
  ],

  "notas_estudo": [
    {
      "lema": "1:1-7",                  // como aparece em negrito no rodapé
      "ref_inicio": "1:1",
      "ref_fim": "1:7",
      "texto": "",                      // VERBATIM
      "palavras_destacadas": [],        // palavras em negrito (procedem do texto da Escritura)
      "_fonte": { }
    }
  ],

  "referencias_cruzadas": [
    {
      "ref": "1:7",
      "alvos": [ "Jó 28:28", "Sl 111:10" ],  // referências parseadas, uma por item
      "_fonte": { }
    }
  ],

  "estudos_palavra": [
    {
      "termo": "",                      // transliteração como impressa
      "idioma": "heb",
      "pronuncia": "",
      "traducao_bkj": "",
      "ocorrencias": { },               // ex.: { "no_livro": 2, "no_at": 13 } — só o que estiver impresso
      "passagem_foco": "Pv 1:7",
      "texto": "",                      // VERBATIM
      "_fonte": { }
    }
  ],

  "recursos_visuais": [                 // opcional; raro em Provérbios
    { "tipo": "quadro", "titulo": "", "descricao": "", "_fonte": { } }
  ]
}
```

## Conferência de fidelidade (por capítulo)

- Nº de versículos catalogados == nº de versículos visíveis na foto.
- Toda nota de estudo, referência cruzada e estudo de palavra da página tem
  registro correspondente, com `_fonte`.
- Nenhum `texto` foi alterado, "corrigido" ou completado.
- `historico_mudancas[]` em `_livro.json` registra a leva ingerida.
