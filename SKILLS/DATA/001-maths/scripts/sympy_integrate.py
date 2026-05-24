#!/usr/bin/env python3
"""Symbolic integral of an expression. Usage: python sympy_integrate.py [expr] e.g. 'sin(x)**2'"""
import sys

def main():
    import sympy as sp
    x = sp.Symbol("x")
    expr_str = sys.argv[1] if len(sys.argv) > 1 else "sin(x)**2"
    locals_map = {"x": x, "sin": sp.sin, "cos": sp.cos, "exp": sp.exp, "log": sp.log}
    expr = sp.sympify(expr_str, locals=locals_map)
    antiderivative = sp.integrate(expr, x)
    print("Integral of", expr, "dx =", antiderivative)
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        print(e, file=sys.stderr)
        sys.exit(1)
