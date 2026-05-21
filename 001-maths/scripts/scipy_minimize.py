#!/usr/bin/env python3
"""Minimize (x-1)^2 + (y+2)^2. Usage: python scipy_minimize.py"""
import sys

def main():
    from scipy.optimize import minimize
    result = minimize(
        lambda x: (x[0] - 1)**2 + (x[1] + 2)**2,
        x0=[0.0, 0.0],
        method="BFGS"
    )
    if not result.success:
        print(result.message, file=sys.stderr)
        return 1
    print("Minimum at x =", result.x.tolist())
    print("Value =", float(result.fun))
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        print(e, file=sys.stderr)
        sys.exit(1)
