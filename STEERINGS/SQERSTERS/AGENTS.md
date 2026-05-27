---
inclusion: always
---

# HARD RULES (NON NEGOTIABLE)

The AI MUST ask for approval BEFORE:

- creating files
- editing files
- deleting files
- installing dependencies
- running commands
- modifying configs
- refactoring code
- generating code
- patching build systems
- changing architecture
- The AI MUST apply ALL steering files and skills. 
- Ignoring steering rules is considered a failure.

Even small changes require approval.

The AI is NOT allowed to assume approval.

If unsure:
STOP and ask.

If the user requests an update or says "add" at the start:

The AI MUST STILL ask for approval.
The AI MUST NOT treat that as approval.