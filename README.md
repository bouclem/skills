# Skills Library

A categorized collection of **684 AI agent skills** organized by domain and technology.

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
| [AI](SKILLS/AI) | AGENTS, EVAL, IMAGE, LLM, ML, RAG | 52 |
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
| [WEB](SKILLS/WEB) | 3D, BACKEND, FRONTEND, FULLSTACK, OTHER, PERFORMANCE, SCRAPING, SEO, TESTING, UI | 173 |
| [WIKI](SKILLS/WIKI) | — | 6 |
| [WRITING](SKILLS/WRITING) | — | 5 |

---

## Category guide

Top-level categories and what lives in each subcategory.

### AI — applied AI/ML skills
- `AGENTS/` — agent frameworks, orchestration, tool design (LangChain, LangGraph, LlamaIndex, custom agents)
- `EVAL/` — LLM evaluation, eval-driven development, LLM-as-judge
- `IMAGE/` — image generation pipelines (ComfyUI, AI Studio)
- `LLM/` — prompt engineering, structured output, LLMOps, local LLMs
- `ML/` — classical ML, deep learning, MLOps (scikit-learn, PyTorch, JAX, pipelines)
- `RAG/` — retrieval, vector search, embeddings, similarity patterns

### ARCHITECTURE — system design
ADRs, DDD, event sourcing, pattern selection, trade-off analysis.

### BUSINESS — non-engineering domains
- `ANALYTICS/` — product analytics, event tracking
- `FINANCE/` — quant analysis, risk metrics
- `LEGAL/` — legal/compliance advisory
- `MANAGEMENT/` — HR, IT mgmt, scheduling, estimation
- `MARKETING/` — ads, growth, sales, ASO, launch strategy
- `PRODUCT/` — product design, PM toolkits
- `STARTUP/` — market sizing, MVP, financial modeling, metrics

### CLOUD — cloud platforms & ops
- `AZURE/` — Azure SDKs (AI, OpenAI, translation, transcription, projects)
- `DEVOPS/` — CI/CD, IaC, observability, incident response
- `KUBERNETES/` — k8s architecture and deployment
- `SERVERLESS/` — serverless platforms, Trigger.dev

### DATA — data engineering & science
pandas, big data, ETL, data quality, scientific computing, warehousing.

### DATABASE — relational + NoSQL
SQL/NoSQL design, Postgres, ORMs, optimization, schema patterns.

### DEVTOOLS — engineering workflow
- `BUILD/` — MSBuild, binlogs, build perf, templates
- `DEBUGGING/` — strategies, error handling, smart debug
- `DOCS/` — code/API documentation generators
- `ENV/` — devcontainers, git, GitHub, IDE, workspace
- `REFACTORING/` — clean code, tech debt, modernization
- `REVIEW/` — code review, audits
- `TESTING/` — TDD, unit testing, test frameworks

### FRAMEWORKS — frontend/app frameworks
- `ALPINE/`, `ANGULAR/`, `ASTRO/`, `ELECTRON/`, `EXPO/`, `REACT/`, `VITE/`, `VUE/`

### GAMES — game development
- `GENERAL/` — game design, engines, abstract strategy
- `GODOT/` — Godot / GDScript
- `HOI4/` — Hearts of Iron IV modding
- `MINECRAFT/` — mods, plugins, datapacks, server admin, resource packs
- `UNITY/` — Unity, ECS, AI-assisted creation
- `UNREAL/` — Unreal Engine C++

### LANGUAGES — per-language skills
One subfolder per language (Bash, C++, C#, Elixir, Go, Haskell, Java, JS, Julia, Kotlin, Lua, PHP, Python, Ruby, Rust, Scala, Swift, TypeScript, plus `OTHER/`).

### META — about the skills themselves
Skill creation, scaffolding, auditing, brainstorming, project skill audits.

### MOBILE — mobile platforms
- `ANDROID/` — Android, Jetpack Compose
- `CROSS/` — cross-platform mobile patterns
- `MAUI/` — .NET MAUI
- `REACT-NATIVE/` — React Native architecture

### OFFICE — productivity / docs
PDF, Word, Excel, PowerPoint, Notion, Gmail, Google Calendar.

### SECURITY — defense & offense
- `AUDIT/` — security audits, compliance, hardening
- `PATTERNS/` — JWT, GDPR, threat modeling, secure coding
- `PENTEST/` — red team, fuzzing, SQL injection
- `REVERSE/` — reverse engineering, anti-RE

### SQERSTERS — my own skills
Skills I wrote myself. Take precedence on duplicate names when building the flat zip.

### WEB — everything web
- `3D/` — three.js, WebGL, R3F
- `BACKEND/` — APIs, GraphQL, Node, payments
- `FRONTEND/` — UI architecture, design taste, PWA
- `FULLSTACK/` — end-to-end app building
- `OTHER/` — browser extensions, bots, weather, maps
- `PERFORMANCE/` — web perf, profiling
- `SCRAPING/` — browser automation, web/wiki/arxiv search
- `SEO/` — SEO, AEO, GEO, schema markup
- `TESTING/` — API mocking, web testing
- `UI/` — design systems, components, CSS, animations, viz

### WIKI — codebase documentation
Wiki architects, onboarding docs, changelogs, Q&A from source.

### WRITING — natural-language work
Proofreading, scientific writing.

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
└── SQERSTERS/                my own steering set (made by me — SQERSTERS)
    ├── AGENTS.md             hard, non-negotiable rules — ask before any change
    ├── all_agent_new.md      global "always do / never do" rules for every task
    ├── code_mastery.md       how I write, review, and improve code
    ├── opensource.md         rules for open-source / external contributions
    └── project_privates.md   rules for private/personal projects
```

### What each file does

| File | Purpose | Always active? |
|---|---|---|
| `AGENTS.md` | **Hard rules.** The agent must ask for approval before creating, editing, deleting, running, refactoring, or installing anything — even on small changes, and even when the user says "update" or "add". Approval is never assumed; the agent must confirm before acting. | Yes |
| `all_agent_new.md` | Global workflow rules: activate ≥2 relevant skills per task, scan for errors, double-check output, keep the 3 core docs (`README.md`, `TODO.md`, `CHANGELOG.md`) under `docs/`, never fabricate, never act without authorization. Defines `ANALYSIS` / `IMPLEMENTATION` / `REVIEW` modes. | Yes |
| `code_mastery.md` | Code quality bar: KISS, single-responsibility functions, security defaults (no hardcoded secrets, parameterized queries), error handling, testing mindset, dependency hygiene, consistency with existing style. | Yes |
| `opensource.md` | When contributing to an external open-source project: don't touch upstream docs, find the root cause first, get explicit approval, ship a minimal fix, open a clean human-toned PR, respect licenses. | Conditional |
| `project_privates.md` | When the project is yours: you own the docs, can update README/TODO/CHANGELOG freely in scope, fix obvious bugs along the way — but new deps, deletions, architecture changes, and auth/crypto/payments still require approval. | Conditional |

### How they work together

- `AGENTS.md`, `all_agent_new.md`, and `code_mastery.md` are **always active**.
- `opensource.md` and `project_privates.md` are **mutually exclusive** — pick one based on the project:
  - Open-source / contributing to someone else's repo → use `opensource.md`.
  - Your own project (full ownership) → use `project_privates.md`.
- Precedence on conflict (from `all_agent_new.md`):
  1. Safety & user control (hard rules in `AGENTS.md`)
  2. Context rules (`opensource.md` or `project_privates.md`)
  3. Code quality (`code_mastery.md`)

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
