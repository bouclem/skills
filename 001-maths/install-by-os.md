# Installation by operating system

OS-specific steps to get Python 3.8+, venv, and pip. After your platform’s section, follow the common steps in [install.md](install.md) (create venv, activate, `pip install numpy scipy sympy mpmath`).

---

## Linux

### Debian / Ubuntu

**Install Python, venv, and pip:**

```bash
sudo apt update
sudo apt install python3 python3-venv python3-pip
```

- Use `python3.10-venv` (or `python3.11-venv`, etc.) if you need a specific minor version:  
  `sudo apt install python3.10 python3.10-venv python3-pip`
- If `python3 -m venv .venv` fails with “ensurepip is not available”, install the matching venv package:  
  `sudo apt install python3.10-venv` (replace with your `python3 --version`).

**Check:** `python3 --version` (3.8 or newer). Then go to [install.md](install.md) Step 2.

### Fedora / RHEL / CentOS

**Fedora:**

```bash
sudo dnf install python3 python3-pip
```

**RHEL / CentOS 8+:**

```bash
sudo dnf install python3 python3-pip
```

Venv is usually included with `python3`. If `python3 -m venv` fails, install `python3-virtualenv` or the matching `python3.X-venv`-style package if your distro provides it.

**Check:** `python3 --version`. Then go to [install.md](install.md) Step 2.

### Arch Linux

```bash
sudo pacman -S python python-pip
```

**Check:** `python3 --version`. Then go to [install.md](install.md) Step 2.

---

## macOS

### Homebrew (recommended)

```bash
brew install python
```

This provides `python3`, `pip3`, and venv. Use `python3` and `pip3` (or create the venv with `python3 -m venv .venv` and use the venv’s `python` and `pip` as in [install.md](install.md)).

**Check:** `python3 --version`. Then go to [install.md](install.md) Step 2.

### python.org installer

1. Download the macOS installer from [python.org/downloads](https://www.python.org/downloads/).
2. Run the installer; ensure “Install pip” and “Add Python to PATH” (or equivalent) are enabled.
3. Open a new terminal and run `python3 --version` (or `py -3` on some setups).

Then go to [install.md](install.md) Step 2.

---

## Windows

### python.org installer (recommended)

1. Download the Windows installer from [python.org/downloads](https://www.python.org/downloads/).
2. Run the installer; **check “Add Python to PATH”**.
3. Choose “Customize” if you want to confirm “pip” and “py launcher” are selected.
4. Open a **new** Command Prompt or PowerShell. Run:  
   `py -3 --version` or `python --version`  
   (Use `py -3` if `python` is not found.)

Then go to [install.md](install.md) Step 2. On Windows, activate the venv with:

- **Command Prompt:** `.venv\Scripts\activate.bat`
- **PowerShell:** `.venv\Scripts\Activate.ps1`  
  (If execution is restricted: `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser`.)

### Winget

```powershell
winget install Python.Python.3.12
```

Close and reopen the terminal, then check `python --version` or `py -3 --version`. Then go to [install.md](install.md) Step 2.

### Microsoft Store

1. Open Microsoft Store, search for **Python 3.12** (or latest 3.x).
2. Install it. It is added to PATH for the current user.
3. Open a new terminal and run `python3 --version` or `python --version`.

Then go to [install.md](install.md) Step 2.

---

## After installing Python and venv

On any OS, from the skill directory:

1. **Create venv:** `python3 -m venv .venv` (Windows: `py -3 -m venv .venv` if `python3` is not in PATH).
2. **Activate:** see [install.md](install.md) Step 2 (Linux/macOS/Windows commands).
3. **Install libraries:** `pip install numpy scipy sympy mpmath`
4. **Verify:** `python -c "import numpy, scipy, sympy, mpmath; print('OK')"`

Full flow is in [install.md](install.md).
