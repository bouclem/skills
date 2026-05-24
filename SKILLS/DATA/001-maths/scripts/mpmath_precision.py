#!/usr/bin/env python3
"""High-precision integral of exp(-x^2) from 0 to inf. Usage: python mpmath_precision.py [dps=80]"""
import sys

def main():
    import mpmath
    dps = int(sys.argv[1]) if len(sys.argv) > 1 else 80
    mpmath.mp.dps = dps
    result = mpmath.quad(lambda x: mpmath.exp(-x**2), [0, mpmath.inf])
    print("Integral(0, inf) exp(-x^2) dx (dps={}) =".format(dps), result)
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        print(e, file=sys.stderr)
        sys.exit(1)
