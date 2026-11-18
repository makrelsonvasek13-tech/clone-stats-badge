# Clone-stats badge

Denní GitHub Action, která uloží počty klonů do `.github/clone-stats/badge.json`
a z něj vyrobí shields.io badge. GitHub traffic API drží historii jen **14 dní**,
proto se data musí sbírat pravidelně — tenhle workflow to dělá každý den.

## Instalace do repa (2 soubory)

1. Zkopíruj do svého repa:
   - `.github/workflows/clone-stats.yml`
   - `clone-badge.mjs` (nebo kamkoli, jen uprav cestu ve workflow)
2. Commit + push. Workflow má `permissions: contents: write`, token `GITHUB_TOKEN` stačí.
3. Actions → **Clone stats badge** → *Run workflow* (první naplnění souboru).
4. Do README přidej badge:

```md
![clones](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/OWNER/REPO/main/.github/clone-stats/badge.json)
```

Volitelně i zobrazení:

```md
![views](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/OWNER/REPO/main/.github/clone-stats/views.json)
```

## Formát `badge.json`

```json
{
  "schemaVersion": 1,
  "label": "clones",
  "message": "42",
  "color": "blue",
  "window": "14 days",
  "uniqueCloners": 7,
  "views": 130,
  "uniqueVisitors": 40,
  "updatedAt": "2026-11-18T00:00:00.000Z",
  "repos": [{ "repo": "muj-repo", "clones": 42, "uniqueCloners": 7, "views": 130, "uniqueVisitors": 40 }]
}
```

`message` je to, co shields.io zobrazí. Chceš-li formát `1,234`, přidej si
v `clone-badge.mjs` `.toLocaleString("en-US")` u `message`.
