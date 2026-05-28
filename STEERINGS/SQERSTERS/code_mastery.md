---
inclusion: always
---

# Code Mastery

> How we write, review, and improve code. Every task. Every time.

---

## Think First

- Understand the problem before touching any code.
- Read the existing code before writing new code.
- Be explicit — no vague logic, no unclear behavior.
- Clean code first, optimize later.
- Name things so anyone can understand them at a glance.

---

## Keep It Simple (KISS)

> Applies to open-source projects or projects you contribute to.

- Prefer the simplest solution that works.
- Avoid clever tricks — readable beats compact.
- If a junior dev can't follow it, simplify it.

---

## Structure

- Small functions, one job each (single responsibility).
- Keep files and functions under ~100 lines when possible.
- Group related logic together — high cohesion, low coupling.
- Follow the project's existing architecture. Don't reinvent it.
- No unnecessary abstractions. Earn every layer of indirection.

---

## Security

- Never trust user input. Validate and sanitize everything.
- Use parameterized queries. Never build SQL or commands with string concatenation.
- Never hardcode secrets, tokens, or credentials.
- Escape output to block XSS, injection, and similar attacks.
- Apply least privilege — only grant the access that's needed.
- Flag any change to auth, crypto, or data handling for review.

---

## Testing

- Write code that's easy to test: small functions, clear inputs and outputs.
- Think about edge cases early: empty, null, boundary, invalid, unexpected.
- When fixing a bug, ask: what test would have caught this?
- Don't mock what you don't own unless there's no other way.
- Test code deserves the same quality as production code.

---

## Debugging

- Don't guess. Confirm with evidence.
- Reproduce the issue first, then fix it.
- Isolate the problem — narrow down which component is failing.
- Use logs, breakpoints, or prints to trace behavior.
- Check edge cases: empty values, null, unexpected input.
- Validate every assumption before applying a fix.

---

## Error Handling

- Handle every potential error. No bare try/catch, no silent swallows.
- Never assume inputs are valid.
- Fail safely — don't crash, don't corrupt state.
- Return clear, predictable outputs.
- Error messages should have enough context to diagnose the problem.

---

## Documentation in Code

- Comment the **why**, not the **what**. Code explains itself.
- Add docstrings / JSDoc to public functions and APIs.
- Keep comments current. Stale comments are worse than no comments.
- Use `TODO(reason): description` or `FIXME(reason): description` — always with context.
- Don't over-comment obvious code.

---

## Performance

- Avoid unnecessary loops and nested operations.
- Watch out for O(n²) or worse — flag it when you see it.
- Cache repeated computations.
- Don't optimize prematurely. Optimize when there's a real reason.
- Be aware of concurrency risks: race conditions, deadlocks, shared state.
- Use async/non-blocking patterns where the project already does.

---

## Dependencies

- Pin versions. No open ranges in production.
- Prefer well-known, actively maintained packages.
- Before adding a dependency: check size, maintenance, license, and alternatives.
- If it's trivial to implement yourself, don't add a package for it.
- Remove unused dependencies when you spot them.

---

## Refactoring

- Leave code a little better than you found it.
- Keep refactors scoped. Don't mix them with feature work.
- Only refactor when it serves the current task or fixes a real problem.
- Always verify behavior is preserved after refactoring.

---

## Quality Checklist

Before delivering any code, check:

- [ ] No syntax errors
- [ ] No logic errors or missed edge cases
- [ ] All imports and dependencies present
- [ ] Follows the project's existing style
- [ ] No unnecessary complexity or dead code
- [ ] No hardcoded secrets or credentials
- [ ] Error messages are clear and useful
- [ ] No security vulnerabilities introduced

---

## Consistency

- Match the project's naming conventions exactly.
- Match formatting, indentation, and file structure.
- Don't introduce a new style unless there's a strong reason.
- Write code that looks like the original author wrote it.

---

## Bottom Line

> The goal isn't just working code.
> It's code that's **clean, safe, maintainable, and easy to understand**.

---
## Skills

> Apply relevant skills based on the technologies in the project.

- Always activate at least 2 skills per task.
- Choose skills that match the project's tech stack.
- Use a minimum of 2 skills per technology area involved.
  - If only 1 skill exists for a technology area, still use it.
  - Example: a project using CSS, Electron, and JS should activate:
    - 2 JS skills
    - 2 CSS skills
    - 2 Electron skills (or 1 if only 1 exists)
- Vary skill selection based on context — don't repeat the same set every time.
---