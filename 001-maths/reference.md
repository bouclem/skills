# Reference: NumPy, SciPy, SymPy, mpmath

One level down from SKILL.md. Use this when you need concrete APIs or patterns.

---

## CLI usage (inline for agents)

- **One-liner**: `python -c 'CODE'` — use single quotes outside, double inside for strings, or escape as needed.
- **Print result**: script must `print()` the answer; agent parses stdout. Use `sys.exit(1)` on failure.
- **Example (NumPy)**: `python -c "import numpy as np; A=np.array([[1,2],[3,4]]); print(np.linalg.inv(A))"`
- **Example (SymPy)**: `python -c "import sympy as sp; x=sp.Symbol('x'); print(sp.integrate(sp.sin(x),x))"`
- **Multi-line**: either semicolons in one string or `python /path/to/script.py`. Prefer a small script over a very long `-c` string.
- **Interpreter**: use `python3` explicitly if the system has both `python` and `python3`.

---

## NumPy

- **Arrays**: `np.array`, `np.zeros`, `np.linspace`, `np.meshgrid`
- **Linear algebra**: `np.linalg.solve`, `np.linalg.inv`, `np.linalg.eig`, `np.linalg.svd`, `np.linalg.norm`
- **FFT**: `np.fft.fft`, `np.fft.ifft`, `np.fft.fft2`
- **Random**: `np.random.default_rng()`, then `.random()`, `.normal()`, `.choice()`
- **Reductions**: `np.sum`, `np.mean`, `np.std` with `axis=` for per-row/column
- Prefer array ops and broadcasting; avoid Python loops over elements.

---

## SciPy

- **Optimization**: `scipy.optimize.minimize`, `scipy.optimize.curve_fit`, `scipy.optimize.root`, `scipy.optimize.linear_sum_assignment`
- **Integration**: `scipy.integrate.quad`, `scipy.integrate.solve_ivp` (ODEs), `scipy.integrate.odeint`
- **Linear algebra**: `scipy.linalg.solve`, `scipy.sparse` for large sparse systems
- **Stats**: `scipy.stats` for distributions, tests, descriptive stats
- **Interpolation**: `scipy.interpolate.interp1d`, `scipy.interpolate.UnivariateSpline`
- **Signal**: `scipy.signal` for filters, convolution, peak finding
- Import by submodule: `from scipy.optimize import minimize`.

---

## SymPy

- **Symbols**: `x = sympy.Symbol('x')` or `sympy.symbols('x y z')`
- **Expressions**: build with `+`, `-`, `*`, `**`, `sympy.sin`, `sympy.exp`, `sympy.log`
- **Simplify**: `expr.simplify()`, `sympy.expand()`, `sympy.factor()`, `sympy.collect()`
- **Solve**: `sympy.solve(expr, x)`, `sympy.solveset(expr, x)`
- **Calculus**: `sympy.diff(expr, x)`, `sympy.integrate(expr, x)`, `sympy.limit(expr, x, point)`
- **Lambdify**: `sympy.lambdify([x], expr, 'numpy')` to get a NumPy-callable function
- **Numerics**: `expr.evalf()` or `expr.n()` for a float; use `sympy.N(expr, n)` for n digits.

---

## mpmath

- **Context**: `mpmath.mp.dps = 50` for 50 decimal digits
- **Types**: `mpmath.mpf`, `mpmath.mpc` for real/complex
- **Special functions**: `mpmath.gamma`, `mpmath.besselj`, `mpmath.erf`, `mpmath.zeta`, etc.
- **Integration**: `mpmath.quad(lambda x: f(x), [a, b])`
- **Root finding**: `mpmath.findroot(f, x0)`
- Use when float64 is insufficient (ill-conditioned, cancellation, or required precision).
