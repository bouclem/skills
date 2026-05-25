---
inclusion: always
---

# Private Project Rules

When working on a private/personal project where the user is the sole owner:

## Ownership
- You OWN all files, including docs (README, CHANGELOG, TODO) — modify freely when needed
- No upstream to respect, no external contributors to coordinate with
- No forks, no PRs required — work directly on the main branch unless told otherwise

## ALLOWED (without asking, when clearly in scope of the task)
- Update the 3 core docs (README.md, TODO.md, CHANGELOG.md) to reflect changes you made
- Fix obvious bugs discovered along the way (mention them in the response)
- Rename/reorganize files you just created if it improves clarity

## STILL REQUIRES APPROVAL
- Any change unrelated to the current task (stay scoped)
- Adding new dependencies
- Deleting files or folders
- Refactoring code outside the current task's scope
- Changing architecture, build setup, or config files
- Anything touching auth, crypto, payments, or data handling

## Workflow
1. **Investigate** — Read existing code before writing new code
2. **Plan** — For multi-file changes, outline the approach first
3. **Implement** — Apply minimal, targeted changes
4. **Verify** — Build/run tests to confirm nothing broke
5. **Document** — Update README.md, TODO.md, CHANGELOG.md if the change is user-facing or version-bumping
6. **Report** — Summarize what changed, flag anything risky

## Code Style
- Follow existing project conventions strictly
- Match naming, formatting, indentation, and file structure already in place
- Don't introduce a new style without a strong reason and explicit approval

## Commits (when asked to commit)
- Small, focused commits — one logical change per commit
- Clear messages: `type(scope): description` (feat, fix, docs, refactor, chore, test)
- Never commit secrets, `.env` files, or credentials
- Never force-push or reset without explicit permission
