#!/usr/bin/env python3
"""Solve Ax = b and optionally compute eigenvalues. Usage: python numpy_solve.py [--eig]"""
import sys

def main():
    import numpy as np
    A = np.array([[1.0, 2.0], [3.0, 4.0]])
    b = np.array([1.0, 0.0])
    x = np.linalg.solve(A, b)
    print("Solution x =", x.tolist())
    if "--eig" in sys.argv:
        w, v = np.linalg.eig(A)
        print("Eigenvalues:", w.tolist())
        print("Eigenvectors (columns):", v.tolist())
    return 0

if __name__ == "__main__":
    try:
        sys.exit(main())
    except Exception as e:
        print(e, file=sys.stderr)
        sys.exit(1)
