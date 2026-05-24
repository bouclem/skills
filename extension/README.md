# Kiro Skills Loader

A VS Code / Kiro extension that discovers Agent Skills laid out in deep, hierarchical folders (categories and subcategories), indexes their companion files, and auto-activates relevant skills as steering files — the same way Kiro picks up `.kiro/steering/*.md`.

## Folder layout it understands

Any depth is fine. The extension walks the configured root and treats every folder containing a `SKILL.md` as a skill.

```
SKILLS/
├── LANGUAGES/CSHARP/001-csharp-pro/
│   ├── SKILL.md
│   ├── references/
│   ├── examples/
│   └── scripts/
├── WEB/SEO/001-seo-fundamentals/
│   └── SKILL.md
└── DEVTOOLS/BUILD/001-msbuild-server/
    ├── SKILL.md
    └── tutorials/
```

Companion folders detected by default: `references`, `examples`, `tutorials`, `scripts`, `evals`, `assets`, `resources`, `templates`, `docs`, `fixtures`, `samples`. You can extend the list in settings.

## What it does

- Recursively scans `SKILLS/**/SKILL.md` (configurable).
- Parses each skill's YAML frontmatter (`name`, `description`, `keywords`).
- Records every companion file so the agent can pull them in.
- Watches the SKILLS folder; re-indexes on changes.
- **Trigger-word auto-toggle**: when the configured trigger word (default `SKILLS`, whole-word, case-sensitive) appears in the active document, matched skills are activated. If they're already active for that document, retyping the trigger deactivates them. Edge-triggered — typing past the word doesn't flap state.
- **Status bar button**: click `$(book) Skills` in the status bar (or press `Ctrl+Alt+S`) to manually toggle skills for the current file regardless of trigger word.
- Provides a sidebar tree view to browse skills and inspect companions.
- Provides commands to open, search, manually activate/deactivate, or regenerate all steering files.

## Settings

| Setting | Default | Description |
|---|---|---|
| `kiroSkills.skillsRoot` | `SKILLS` | Workspace-relative path to the skills root. |
| `kiroSkills.companionFolders` | see above | Folder names treated as companion content. |
| `kiroSkills.autoSteering` | `true` | Auto-toggle steering when the trigger word is present. |
| `kiroSkills.triggerWord` | `SKILLS` | Whole-word, case-sensitive trigger that gates auto-activation. |
| `kiroSkills.steeringInclusion` | `fileMatch` | `fileMatch`, `manual`, or `always`. |
| `kiroSkills.maxKeywordChars` | `6000` | Max chars of SKILL.md body embedded in a steering snippet. |

## Commands

- **Skills: Refresh Index**
- **Skills: Open SKILL.md**
- **Skills: Activate (write steering)**
- **Skills: Deactivate (remove steering)**
- **Skills: Regenerate All Steering Files**
- **Skills: Search by Keyword**
- **Skills: Toggle for Active File** — also bound to `Ctrl+Alt+S` and the status bar button.

## Generated steering files

Files are namespaced as `skill--<category-slug>--<id>.md` so they never collide with hand-written steering files. Header comment marks them as machine-generated. The frontmatter inclusion mode controls when Kiro picks them up:

- `fileMatch` — auto-derived patterns (e.g. `**/*.py` for Python skills).
- `manual` — only via `#<file>` in chat.
- `always` — always-on (use sparingly).

## Build & run locally

```bash
cd extension
npm install
npm run compile
# Run in VS Code: Press F5 ("Run Extension") with this folder open.
# To package: npm run package  (produces kiro-skills-loader.vsix)
# Then: code --install-extension kiro-skills-loader.vsix
```

## Notes

- The extension does not modify, rename, or move skill files. It only reads them and writes namespaced files inside `.kiro/steering/`.
- Auto-activated skills are kept across sessions: on load, the extension reads `.kiro/steering/skill--*.md` to know what's already active.
- Threshold for auto-activation is conservative (score ≥ 4) to avoid noise. Use **Skills: Search by Keyword** for manual control.
