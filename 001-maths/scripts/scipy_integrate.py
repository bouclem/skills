#!/usr/bin/env python3
"""Compute definite integral of exp(-t^2) from 0 to inf (Gaussian). Usage: python scipy_integrate.py"""
import sys

def main():
    from scipy.integrate import quad
    import numpy as np
    value, err = quad(lambda t: np.exp(-t**2), 0, np.inf)
    print("Integral(0, inf) exp(-t^2) dt =", value)
    print("Estimated error =", err)
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        print(e, file=sys.stderr)
        sys.exit(1)
