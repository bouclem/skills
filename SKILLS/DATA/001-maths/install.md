# Setup: Python venv and maths libraries

Use a virtual environment for this skill. Follow these steps.

**Install on your OS:** For per-platform install commands (Linux, macOS, Windows), see [install-by-os.md](install-by-os.md).

---

## Step 1: Confirm Python is available

```bash
python3 --version
```

You need Python 3.8 or newer. If `python3` is missing or venv creation fails, follow [install-by-os.md](install-by-os.md) for your operating system.

---

## Step 2: Create and activate a virtual environment

**Create the venv** (e.g. in the project root or in `skills/maths/`):

```bash
python3 -m venv .venv
```

**Activate it:**

- Linux/macOS: `source .venv/bin/activate`
- Windows (cmd): `.venv\Scripts\activate.bat`
- Windows (PowerShell): `.venv\Scripts\Activate.ps1`

After activation, the prompt usually shows `(.venv)`. Use `python` and `pip` from this shell; they refer to the venv.

---

## Step 3: Install the maths libraries

With the venv activated:

```bash
pip install numpy scipy sympy mpmath
```

If `pip` is not on PATH:

```bash
python -m pip install numpy scipy sympy mpmath
```

**Verify:**

```bash
python -c "import numpy, scipy, sympy, mpmath; print('OK')"
```

If you see `OK`, the environment is ready.

---

## Step 4: Run scripts from the skill

With the venv still activated, from the skill directory (e.g. `skills/maths/`):

```bash
python scripts/numpy_solve.py
```

---

## Troubleshooting

| Issue | Action |
|-------|--------|
| `pip: command not found` | Use `python -m pip` (with venv activated). |
| `No module named 'numpy'` (or others) | Activate the venv, then run Step 3. Run scripts only after activating the same venv. |
| Permission errors when installing | Install only inside the venv (do not use `--user` for this skill). |
| Wrong Python version | Create the venv with the desired interpreter: `python3.11 -m venv .venv`. |
