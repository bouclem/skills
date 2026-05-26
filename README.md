# Skills Library

A categorized collection of **676 AI agent skills** organized by domain and technology.

All skills live under `SKILLS/` and follow the standard Agent Skills layout:

```
SKILLS/<CATEGORY>[/<SUBCATEGORY>]/<skill-folder>/
├── SKILL.md          # Required — the skill itself
├── references/       # Optional — supporting docs
├── scripts/          # Optional — executable helpers
├── evals/            # Optional — evaluation cases
└── ...
```

---

## Categories

| Category | Subcategories | Skills |
|---|---|---|
| [AI](SKILLS/AI) | AGENTS, EVAL, IMAGE, LLM, ML, RAG | 49 |
| [ARCHITECTURE](SKILLS/ARCHITECTURE) | — | 7 |
| [BUSINESS](SKILLS/BUSINESS) | ANALYTICS, FINANCE, LEGAL, MANAGEMENT, MARKETING, PRODUCT, STARTUP | 38 |
| [CLOUD](SKILLS/CLOUD) | AZURE, DEVOPS, KUBERNETES, SERVERLESS | 29 |
| [DATA](SKILLS/DATA) | — | 22 |
| [DATABASE](SKILLS/DATABASE) | — | 17 |
| [DEVTOOLS](SKILLS/DEVTOOLS) | BUILD, DEBUGGING, DOCS, ENV, REFACTORING, REVIEW, TESTING | 116 |
| [FRAMEWORKS](SKILLS/FRAMEWORKS) | ALPINE, ANGULAR, ASTRO, ELECTRON, EXPO, REACT, VITE, VUE | 32 |
| [GAMES](SKILLS/GAMES) | GENERAL, GODOT, HOI4, MINECRAFT, UNITY, UNREAL | 24 |
| [LANGUAGES](SKILLS/LANGUAGES) | BASH, CPP, CSHARP, ELIXIR, GO, HASKELL, JAVA, JAVASCRIPT, JULIA, KOTLIN, LUA, OTHER, PHP, PYTHON, RUBY, RUST, SCALA, SWIFT, TYPESCRIPT | 83 |
| [META](SKILLS/META) | — | 26 |
| [MOBILE](SKILLS/MOBILE) | ANDROID, CROSS, MAUI, REACT-NATIVE | 14 |
| [OFFICE](SKILLS/OFFICE) | — | 9 |
| [SECURITY](SKILLS/SECURITY) | AUDIT, PATTERNS, PENTEST, REVERSE | 28 |
| [SQERSTERS](SKILLS/SQERSTERS) | — | 3 |
| [WEB](SKILLS/WEB) | 3D, BACKEND, FRONTEND, FULLSTACK, OTHER, PERFORMANCE, SCRAPING, SEO, TESTING, UI | 169 |
| [WIKI](SKILLS/WIKI) | — | 6 |
| [WRITING](SKILLS/WRITING) | — | 4 |

---

## Tree

```
SKILLS/
├── AI/
│   ├── AGENTS/         agent frameworks, orchestration, tool use
│   ├── EVAL/           LLM evals, eval-driven dev, judging
│   ├── IMAGE/          image generation, ComfyUI
│   ├── LLM/            prompt engineering, LLMOps, structured output
│   ├── ML/             classical ML, deep learning, MLOps
│   └── RAG/            retrieval, vector search, embeddings
├── ARCHITECTURE/       ADRs, DDD, event sourcing, system design
├── BUSINESS/
│   ├── ANALYTICS/      product analytics, tracking
│   ├── FINANCE/        risk metrics, quant analysis
│   ├── LEGAL/          legal advisory
│   ├── MANAGEMENT/     HR, IT mgmt, scheduling, estimation
│   ├── MARKETING/      ads, growth, sales, ASO
│   ├── PRODUCT/        product design, PM toolkits
│   └── STARTUP/        market sizing, MVP, financial modeling
├── CLOUD/
│   ├── AZURE/          Azure SDKs (AI, OpenAI, translation, etc.)
│   ├── DEVOPS/         CI/CD, IaC, observability, incident response
│   ├── KUBERNETES/     k8s architecture and deployment
│   └── SERVERLESS/     serverless platforms, Trigger.dev
├── DATA/               pandas, big data, ETL, scientific computing
├── DATABASE/           SQL, NoSQL, Postgres, ORMs
├── DEVTOOLS/
│   ├── BUILD/          MSBuild, binlogs, templates, build perf
│   ├── DEBUGGING/      debugging strategies, error handling
│   ├── DOCS/           code/API documentation generators
│   ├── ENV/            devcontainers, git, build, IDE, GitHub, workspace
│   ├── REFACTORING/    clean code, tech debt, modernization
│   ├── REVIEW/         code review, audits
│   └── TESTING/        TDD, unit testing, test frameworks
├── FRAMEWORKS/
│   ├── ALPINE/         Alpine.js
│   ├── ANGULAR/        Angular ecosystem
│   ├── ASTRO/          Astro
│   ├── ELECTRON/       Electron desktop apps
│   ├── EXPO/           Expo / React Native tooling
│   ├── REACT/          React, Next.js
│   ├── VITE/           Vite
│   └── VUE/            Vue.js
├── GAMES/
│   ├── GENERAL/        game design, engines, strategy
│   ├── GODOT/          Godot / GDScript
│   ├── HOI4/           Hearts of Iron IV modding
│   ├── MINECRAFT/      mods, plugins, datapacks, server admin
│   ├── UNITY/          Unity development
│   └── UNREAL/         Unreal Engine C++
├── LANGUAGES/          per-language skills (see table above)
├── META/               skill creation, auditing, brainstorming
├── MOBILE/
│   ├── ANDROID/        Android, Jetpack Compose
│   ├── CROSS/          cross-platform mobile
│   ├── MAUI/           .NET MAUI
│   └── REACT-NATIVE/   React Native architecture
├── OFFICE/             PDF, office productivity, Excel, Word, PowerPoint, Notion, Gmail, Calendar
├── SECURITY/
│   ├── AUDIT/          security audits, compliance, hardening
│   ├── PATTERNS/       JWT, GDPR, threat modeling
│   ├── PENTEST/        red team, fuzzing, SQL injection
│   └── REVERSE/        reverse engineering, anti-RE
├── SQERSTERS/          my own skills (made by me — SQERSTERS)
├── WEB/
│   ├── 3D/             three.js, WebGL, R3F
│   ├── BACKEND/        APIs, GraphQL, Node, payments
│   ├── FRONTEND/       UI architecture, design taste, PWA
│   ├── FULLSTACK/      end-to-end app building
│   ├── OTHER/          browser extensions, bots, weather, maps
│   ├── PERFORMANCE/    web perf, profiling
│   ├── SCRAPING/       browser automation, web/wiki/arxiv search
│   ├── SEO/            SEO, AEO, GEO, schema markup
│   ├── TESTING/        API mocking, web testing
│   └── UI/             design systems, components, CSS, animations, viz
├── WIKI/               codebase wikis, onboarding docs
└── WRITING/            proofreading, scientific writing
```

---

## Finding a skill

- **By tech**: jump to `LANGUAGES/<LANG>` or `FRAMEWORKS/<NAME>`.
- **By task**: pick the matching domain (e.g. debugging → `DEVTOOLS/DEBUGGING`, SEO → `WEB/SEO`).
- **By name**: search the tree — every folder is named `001-<skill-slug>`.

Each folder contains a `SKILL.md` with the activation keywords and full instructions.

---

## Layout rules

- One skill per folder.
- A skill goes in the **single category that fits it best** — no duplication.
- Subcategories are uppercase. Skill folders keep the `001-` prefix.
- Top-level categories without a clear subcategory split (e.g. `DATA`, `DATABASE`, `META`) hold skills directly.

---

## Steerings

The `STEERINGS/` folder holds my personal AI steering rules — open-sourced so anyone can use or adapt them.

```
STEERINGS/
└── SQERSTERS/          my own steering set (made by me — SQERSTERS)
    ├── all_agent_new.md    global rules every agent must follow
    ├── code_mastery.md     how I write, review, and improve code
    ├── opensource.md       rules for open-source contributions
    └── project_privates.md rules for private/personal projects
```

### How they work together

- `all_agent_new.md` and `code_mastery.md` are always active.
- `opensource.md` and `project_privates.md` are **mutually exclusive**:
  - If `project_privates.md` is present in the project, **`opensource.md` does not apply**.
  - Use `opensource.md` only when contributing to an external/open-source project.
  - Use `project_privates.md` when the project is yours (full ownership, free to edit docs, etc.).

Drop the files you want into your agent's steering folder (for example `~/.kiro/steering/`) to use them.

---

## Building a flat zip for installation

Some agents (Kiro included) only read skill folders at the **root** of their skills directory — they don't recurse into category subfolders. To install this whole library into such an agent, build a flat zip first:

```powershell
# From the repo root
powershell -ExecutionPolicy Bypass -File scripts\Build-SkillsZip.ps1 -Force
```

This produces `dist/skills.zip` with every `001-*` skill folder placed at the **root** of the archive (no `AI/`, `WEB/`, etc. wrappers). Extract the zip into the agent's skills directory and every skill is where the agent expects it.

### Scripts

| Script | What it does |
|---|---|
| [`scripts/Build-SkillsZip.ps1`](scripts/Build-SkillsZip.ps1) | Walks `SKILLS/` recursively, finds every `001-*` folder containing a `SKILL.md`, and packs them into a flat zip at `dist/skills.zip`. |
| [`scripts/Test-SkillsZip.ps1`](scripts/Test-SkillsZip.ps1) | Verifies the produced zip: every top-level entry is a `001-*` folder, no nested `001-/001-` paths, every skill has a `SKILL.md`, no empty folders. Exits non-zero on failure. |

### Build options

```powershell
# Default — skip duplicates with a warning, output to dist/skills.zip
powershell -File scripts\Build-SkillsZip.ps1 -Force

# Keep both copies of any duplicate, suffixed by category path
powershell -File scripts\Build-SkillsZip.ps1 -OnDuplicate Suffix -Force

# Stop with an error if any duplicates exist (useful in CI)
powershell -File scripts\Build-SkillsZip.ps1 -OnDuplicate Fail

# Custom output location
powershell -File scripts\Build-SkillsZip.ps1 -OutFile C:\path\to\my-skills.zip -Force

# Verify the result
powershell -File scripts\Test-SkillsZip.ps1
```

### Duplicate handling

`SKILLS/SQERSTERS/` is given priority on duplicate skill names — if the same `001-<name>` folder exists in both `SQERSTERS/` and a community category, the SQERSTERS version is kept. Currently the only collision is `001-hoi4-skills` (in `GAMES/HOI4/` and `SQERSTERS/`).
