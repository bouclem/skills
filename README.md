# Skills Library

A categorized collection of **565 AI agent skills** organized by domain and technology.

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
| [AI](SKILLS/AI) | AGENTS, EVAL, IMAGE, LLM, ML, RAG | 47 |
| [ARCHITECTURE](SKILLS/ARCHITECTURE) | — | 7 |
| [BUSINESS](SKILLS/BUSINESS) | ANALYTICS, FINANCE, LEGAL, MANAGEMENT, MARKETING, PRODUCT, STARTUP | 37 |
| [CLOUD](SKILLS/CLOUD) | AZURE, DEVOPS, KUBERNETES, SERVERLESS | 29 |
| [DATA](SKILLS/DATA) | — | 22 |
| [DATABASE](SKILLS/DATABASE) | — | 16 |
| [DEVTOOLS](SKILLS/DEVTOOLS) | DEBUGGING, DOCS, ENV, REFACTORING, REVIEW, TESTING | 54 |
| [FRAMEWORKS](SKILLS/FRAMEWORKS) | ALPINE, ANGULAR, ASTRO, ELECTRON, EXPO, REACT, VITE, VUE | 32 |
| [GAMES](SKILLS/GAMES) | GENERAL, GODOT, HOI4, MINECRAFT, UNITY, UNREAL | 24 |
| [LANGUAGES](SKILLS/LANGUAGES) | BASH, CPP, CSHARP, ELIXIR, GO, HASKELL, JAVA, JAVASCRIPT, JULIA, KOTLIN, LUA, OTHER, PHP, PYTHON, RUBY, RUST, SCALA, SWIFT, TYPESCRIPT | 72 |
| [META](SKILLS/META) | — | 23 |
| [MOBILE](SKILLS/MOBILE) | ANDROID, CROSS, REACT-NATIVE | 6 |
| [OFFICE](SKILLS/OFFICE) | — | 2 |
| [SECURITY](SKILLS/SECURITY) | AUDIT, PATTERNS, PENTEST, REVERSE | 29 |
| [WEB](SKILLS/WEB) | 3D, BACKEND, FRONTEND, FULLSTACK, OTHER, PERFORMANCE, SCRAPING, SEO, TESTING, UI | 156 |
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
│   ├── DEBUGGING/      debugging strategies, error handling
│   ├── DOCS/           code/API documentation generators
│   ├── ENV/            devcontainers, git, build, IDE
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
│   └── REACT-NATIVE/   React Native architecture
├── OFFICE/             PDF, office productivity
├── SECURITY/
│   ├── AUDIT/          security audits, compliance, hardening
│   ├── PATTERNS/       JWT, GDPR, threat modeling
│   ├── PENTEST/        red team, fuzzing, SQL injection
│   └── REVERSE/        reverse engineering, anti-RE
├── WEB/
│   ├── 3D/             three.js, WebGL, R3F
│   ├── BACKEND/        APIs, GraphQL, Node, payments
│   ├── FRONTEND/       UI architecture, design taste, PWA
│   ├── FULLSTACK/      end-to-end app building
│   ├── OTHER/          browser extensions, bots
│   ├── PERFORMANCE/    web perf, profiling
│   ├── SCRAPING/       browser automation, scraping
│   ├── SEO/            SEO, AEO, GEO, schema markup
│   ├── TESTING/        API mocking, web testing
│   └── UI/             design systems, components, CSS, animations
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
