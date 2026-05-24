# Kiro Skills Loader

A VS Code / Kiro extension that maintains a hierarchical skill library and **installs** skills into Kiro's flat skills folder so Kiro can auto-activate them by description matching.

## Three folders, three jobs

| Folder | Layout | Purpose |
|---|---|---|
| `<workspace>/SKILLS/` | Deep, categorized (`AI/AGENTS/...`) | Source of truth, version-controlled |
| `~/.kiroskills/` | Same deep hierarchy | Master library, persists across all workspaces |
| `~/.kiro/skills/` | Flat (`<skill-name>/SKILL.md`) | What Kiro actually reads. Auto-activation happens here. |

The extension keeps the first two in sync (workspace → user library, never deletes), then installs into the third on demand.

## How activation works

Per the [Kiro docs](https://kiro.dev/docs/skills/):
- Kiro reads the `name` and `description` from each SKILL.md frontmatter at startup
- When your **chat message** matches a description, Kiro loads that skill's instructions
- You can also invoke skills explicitly with `/skill-name`

This extension doesn't touch activation — it just makes sure skills are **present in the right place** with valid frontmatter, so Kiro's own matcher can do the work. That's why activation is deterministic: it's based on your chat message, not random scoring.

## Behavior

- On startup: scans `<workspace>/SKILLS/` and `~/.kiroskills/` and merges them into a unified index
- On refresh: copies any new workspace skills into the user library (additive only)
- On trigger: when the word `SKILLS` (whole-word, case-sensitive) appears in the active document for the first time, all indexed skills are **installed** into `~/.kiro/skills/`. Type `SKILLS` again later → uninstall.
- Status bar: `$(book) Skills (global)` — click to toggle install. Shows count when installed.
- Frontmatter normalization: install rewrites the COPY's `name:` to match the folder, fills in `description:` if missing. Source files are never modified.

## Settings

| Setting | Default | What |
|---|---|---|
| `kiroSkills.skillsRoot` | `SKILLS` | Workspace-relative library root. |
| `kiroSkills.userSkillsRoot` | `~/.kiroskills` | User-level master library. |
| `kiroSkills.syncToUserOnRefresh` | `true` | Auto-sync library on every refresh. |
| `kiroSkills.installScope` | `global` | `global` = `~/.kiro/skills`. `workspace` = `<ws>/.kiro/skills`. |
| `kiroSkills.autoInstall` | `true` | Auto-toggle on trigger word. |
| `kiroSkills.triggerWord` | `SKILLS` | Whole-word, case-sensitive trigger. |
| `kiroSkills.companionFolders` | `references, examples, tutorials, scripts, evals, assets, resources, templates, docs, fixtures, samples` | Folders treated as companion content. |

## Commands

- **Skills: Refresh Index**
- **Skills: Toggle Install** (status bar / `Ctrl+Alt+S`)
- **Skills: Install All Into Kiro Skills Folder**
- **Skills: Uninstall All From Kiro Skills Folder**
- **Skills: Search by Keyword** (browse without installing)
- **Skills: Open SKILL.md**
- **Skills: Sync Workspace To User Library**
- **Skills: Open User Library Folder** (reveals `~/.kiroskills`)
- **Skills: Open Kiro Install Folder** (reveals `~/.kiro/skills`)

## Build & install

```cmd
cd extension
npm install
npm run package
kiro --install-extension kiro-skills-loader.vsix --force
```

Reload the window. Open any non-`SKILL.md` file, type `SKILLS`, watch the status bar count change. Reload Kiro after install for the skills to be picked up by Kiro's own discovery.

## Notes

- Frontmatter rewriting is in-copy only — your source SKILL.md files are never modified.
- Kiro's spec requires `name: lowercase-letters-numbers-hyphens-only`, max 64 chars. The extension sanitizes names automatically (e.g. underscores → hyphens).
- Idempotent: re-running install only updates files; never duplicates skills.
- A manifest (`kiro-skills-loader.manifest.json`) inside the install folder tracks what's ours, so uninstall doesn't touch hand-written skills.
