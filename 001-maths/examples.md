# Examples

Worked snippets and **CLI-invokable scripts** for common tasks. See [reference.md](reference.md) for API details.

---

## How to use from the CLI

Activate the venv first (see [install.md](install.md)). Scripts live in `scripts/` relative to this skill. Run from the skill root (e.g. `skills/maths/`) using the venv’s `python`.

### Scripts (execute these)

| Use case | Command | Notes |
|----------|---------|--------|
| **NumPy: solve Ax = b** | `python scripts/numpy_solve.py` | Prints solution vector. Add `--eig` for eigenvalues. |
| **NumPy: solve + eigenvalues** | `python scripts/numpy_solve.py --eig` | |
| **SciPy: minimize** | `python scripts/scipy_minimize.py` | Minimizes (x-1)² + (y+2)², prints optimum. |
| **SciPy: definite integral** | `python scripts/scipy_integrate.py` | Gaussian ∫₀^∞ exp(-t²) dt. |
| **SymPy: solve equation** | `python scripts/sympy_solve.py "x**2 - 4"` | Prints roots. Default: x²-4. |
| **SymPy: symbolic integral** | `python scripts/sympy_integrate.py "sin(x)**2"` | Antiderivative in x. Default: sin(x)². |
| **mpmath: high-precision integral** | `python scripts/mpmath_precision.py` | Optional arg: dps (default 80). |

**From workspace root** (activate venv first if it lives in the skill dir):

```bash
cd skills/maths && source .venv/bin/activate && python scripts/numpy_solve.py
cd skills/maths && python scripts/sympy_solve.py "x**3 - 2*x"
```

**One-liners (no script):**

```bash
python -c "import numpy as np; A=np.array([[1,2],[3,4]]); b=np.array([1,0]); print(np.linalg.solve(A,b))"
python -c "import sympy as sp; x=sp.Symbol('x'); print(sp.solve(x**2-4, x))"
python -c "import sympy as sp; x=sp.Symbol('x'); print(sp.integrate(sp.sin(x)**2, x))"
python -c "from scipy.integrate import quad; import numpy as np; v,e=quad(lambda t: np.exp(-t**2),0,np.inf); print(v)"
```

---

## NumPy: solve Ax = b, eigenvalues

```python
import numpy as np
A = np.array([[1, 2], [3, 4]])
b = np.array([1, 0])
x = np.linalg.solve(A, b)
eigenvalues, eigenvectors = np.linalg.eig(A)
```

## SciPy: minimize, integrate, ODE

```python
from scipy.optimize import minimize
from scipy.integrate import quad, solve_ivp

# Minimize scalar function
result = minimize(lambda x: (x[0] - 1)**2 + (x[1] + 2)**2, x0=[0, 0])

# Definite integral
value, err = quad(lambda t: np.exp(-t**2), 0, np.inf)

# ODE: dy/dt = f(t, y)
sol = solve_ivp(lambda t, y: -y, [0, 5], [1.0], dense_output=True)
```

## SymPy: symbolic derivative and solve

```python
import sympy as sp
x = sp.Symbol('x')
expr = sp.sin(x)**2 + sp.exp(x)
derivative = sp.diff(expr, x)
solutions = sp.solve(expr - 1, x)
```

## mpmath: high-precision integral

```python
import mpmath
mpmath.mp.dps = 80
result = mpmath.quad(lambda x: mpmath.exp(-x**2), [0, mpmath.inf])
```
