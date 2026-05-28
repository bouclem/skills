# Agent Tree

## Goal

`agent-tree.md` creates a persistent contextual memory system for Kiro agents.

The objective is to:
- reduce unnecessary project re-reading
- reduce credit/token usage
- improve long-term project understanding
- preserve important context between tasks
- improve large-project handling

---

# Structure

When enabled, the system creates:

```txt
.kiro/
└── agent-tree/
```

Inside this folder:

```txt
agent-tree/
├── memory/
├── context/
├── refresh/
├── research/
└── metadata/
```

---

# memory/

Stores persistent memories explicitly requested by the user.

Purpose:
- preserve important long-term information
- avoid repeated explanations
- maintain workflow continuity

Examples:
- coding preferences
- architecture decisions
- project rules
- naming conventions
- important reminders
- workflow habits

Example structure:

```txt
memory/
├── user-preferences.md
├── architecture-rules.md
├── important-decisions.md
└── coding-style.md
```

---

# context/

Stores summarized project understanding.

Purpose:
- avoid repeatedly scanning the entire project
- summarize important files and folders
- explain architecture and systems
- cache contextual understanding

The agent may summarize:
- folders
- files
- important code sections
- dependencies
- architecture systems
- APIs
- rendering pipelines
- game systems

Example structure:

```txt
context/
├── project-overview.md
├── backend-summary.md
├── frontend-summary.md
├── api-routes.md
├── systems/
│   ├── auth-system.md
│   ├── renderer.md
│   └── physics.md
└── important-files/
    ├── engine-java.md
    └── app-tsx.md
```

---

# refresh/

Handles automatic context refreshing.

Purpose:
- update outdated summaries
- detect modified files
- refresh important context automatically

Features:
- file change detection
- automatic summary regeneration
- smart partial refreshes
- dependency-aware updates

Example:

```txt
refresh/
├── changed-files.md
├── refresh-queue.md
└── stale-context.md
```
---

# ideas/

Stores project ideas, concepts, future plans, experimental thoughts, and AI-generated suggestions.

Purpose:
- preserve spontaneous ideas
- avoid losing concepts
- organize future features
- maintain creative continuity
- help long-term planning
- allow the agent to propose and store its own ideas

Ideas may come from:
- the user
- the agent itself
- project analysis
- detected patterns
- research results
- architecture observations

Ideas may include:
- feature ideas
- gameplay mechanics
- optimization concepts
- architecture redesigns
- UI concepts
- experimental systems
- future updates
- random inspiration notes
- AI-generated improvement suggestions

Example structure:

```txt
ideas/
├── future-features.md
├── optimization-ideas.md
├── gameplay-concepts.md
├── ui-redesign.md
├── ai-generated/
│   ├── renderer-improvements.md
│   ├── architecture-suggestions.md
│   └── optimization-proposals.md
├── experiments/
│   ├── voxel-renderer.md
│   └── ai-npc-system.md
└── todo/
    ├── high-priority.md
    └── low-priority.md
```

The agent may:
- suggest improvements
- propose optimizations
- recommend refactors
- detect missing systems
- generate experimental concepts
- propose better architectures
- create feature suggestions based on project direction

The ideas system may:
- rank ideas by priority
- connect ideas to project systems
- merge duplicate concepts
- track implementation status
- detect abandoned ideas
- mark whether an idea came from:
  - user
  - agent
  - research
  - automated analysis

Possible idea states:
- concept
- planned
- experimental
- in-progress
- implemented
- abandoned

---

# research/

Stores external knowledge related to the project.

Purpose:
- preserve useful internet research
- avoid repeating the same searches
- improve contextual understanding
- connect external knowledge to project systems

This may include:
- scientific research
- internet searches
- framework documentation
- technical explanations
- benchmarks
- architecture references
- optimization techniques
- API documentation
- security research

Research may be linked directly to:
- files
- folders
- systems
- dependencies
- project features

Example structure:

```txt
research/
├── physics-research.md
├── rendering-techniques.md
├── ai-optimization.md
├── lwjgl-notes.md
├── networking/
│   ├── websocket-research.md
│   └── packet-sync.md
└── linked-context/
    ├── engine-java.md
    └── renderer.md
```

---

# metadata/

Stores internal metadata used by the system.

May include:
- last refresh timestamps
- importance scores
- context age (that is by minute/hours)
- dependency tracking
- project maps

Example:

```txt
metadata/
├── context-age.json
├── importance-map.json
├── dependency-tree.json
└── refresh-log.md
```

---

# Auto Refresh

The system may automatically refresh summaries when:
- files are modified
- architecture changes
- dependencies change
- folders are reorganized
- important systems are updated

The refresh system should:
- avoid unnecessary refreshes
- prioritize important files
- preserve stable summaries
- refresh only affected context

---

# Context Aging

Context summaries become older over time.

Old context may become:
- partially outdated
- inaccurate
- inconsistent with the current codebase

The system tracks context age and marks summaries for refresh.

Possible aging states:
- fresh
- stable
- aging
- stale
- expired

The older a summary becomes:
- the lower its confidence
- the higher its refresh priority

---

# Benefits

- lower credit usage
- less repeated analysis
- faster reasoning
- improved project continuity
- better large-project understanding
- persistent external knowledge
- improved research continuity
- more stable agent memory
- improved multi-agent coordination

---

# Future Ideas

## Importance Ranking

Ranks files and systems by relevance.

## Smart Loading

Loads only relevant summaries depending on the task.

## Multi-Agent Shared Context

Allows multiple agents to share the same contextual tree.

## Dependency Mapping

Creates relationship maps between systems and files.

## Context Compression

Compresses old summaries into smaller memory-efficient forms.

## Semantic Search

Search through summaries instead of scanning the full project.

## Research Linking

Automatically connects research files to related systems and code files.

## Hybrid Knowledge Graph

Combines:
- project context
- memory
- research
- dependencies
- architecture
into a connected intelligence graph.