#!/usr/bin/env python3
"""Solve equation(s) symbolically. Usage: python sympy_solve.py [equation] e.g. 'x**2 - 4'"""
import sys

def main():
    import sympy as sp
    x = sp.Symbol("x")
    expr_str = sys.argv[1] if len(sys.argv) > 1 else "x**2 - 4"
    expr = sp.sympify(expr_str)
    sols = sp.solve(expr, x)
    print("Equation:", expr, "= 0")
    print("Solutions:", sols)
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        print(e, file=sys.stderr)
        sys.exit(1)
