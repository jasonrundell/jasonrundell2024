"""Vectorize a line-art PNG into a Pencil script (.js) that returns scalable path nodes.

Usage: python _trace_to_js.py <input.png> <output.js> [color_precision] [layer_difference] [filter_speckle]
Defaults: color_precision=5, layer_difference=32, filter_speckle=16.
Maps traced colors to site tokens: ink graphite lines, paper background, single forest accent.
"""
import re
import sys
import json
from collections import Counter

import vtracer

INK = "#2E3338"
PAPER = "#F7F8FA"
ACC = "#1F4D3A"


def trace(inp, svg, cp=5, ld=32, fs=16):
    vtracer.convert_image_to_svg_py(
        inp, svg,
        colormode="color", hierarchical="stacked", mode="spline",
        filter_speckle=fs, color_precision=cp, layer_difference=ld,
        corner_threshold=60, length_threshold=5.0, max_iterations=10,
        splice_threshold=45, path_precision=2,
    )


def attr(tag, name):
    m = re.search(name + r'="([^"]*)"', tag)
    return m.group(1) if m else ""


def bake(d, tx, ty):
    """Bake a translate() transform into absolute path coordinates (M/C/Z only)."""
    toks = re.findall(r"[MCZ]|-?\d+\.?\d*", d)
    out = []
    k = 0
    for tk in toks:
        if tk in "MCZ":
            out.append(tk)
        else:
            v = float(tk) + (tx if k % 2 == 0 else ty)
            k += 1
            out.append(("%.1f" % v).rstrip("0").rstrip("."))
    res = ""
    for tk in out:
        res += (" " + tk + " ") if tk in "MCZ" else (tk + " ")
    return re.sub(r"\s+", " ", res).strip()


def nums(d):
    return [float(x) for x in re.findall(r"-?\d+\.?\d*", d)]


def bbox(d):
    n = nums(d)
    xs, ys = n[0::2], n[1::2]
    if not xs or not ys:
        return None
    return min(xs), min(ys), max(xs), max(ys)


def hx(h):
    h = (h or "").strip().lstrip("#")
    if len(h) == 3:
        h = "".join(c * 2 for c in h)
    if len(h) != 6 or any(c not in "0123456789abcdefABCDEF" for c in h):
        raise ValueError("expected hex color, got %r" % h)
    return int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)


def classify(f):
    f = (f or "").strip().lower()
    if not f or f == "none":
        return "ink"
    try:
        r, g, b = hx(f)
    except ValueError as e:
        raise ValueError("unusable path fill %r: %s" % (f, e)) from e
    if g >= 45 and (g - r) >= 15 and (g - b) >= 6:
        return "accent"
    if min(r, g, b) > 205:
        return "paper"
    return "ink"


def convert(inp, out_js, cp=5, ld=32, fs=16):
    svg = out_js.rsplit(".", 1)[0] + "_trace.svg"
    trace(inp, svg, cp, ld, fs)
    s = open(svg, encoding="utf-8").read()
    tags = re.findall(r"<path\b[^>]*?/?>", s)
    paths = []
    for t in tags:
        d = attr(t, "d")
        tr = attr(t, "transform")
        m = re.search(r"translate\(([-\d.]+),([-\d.]+)\)", tr)
        tx, ty = (float(m.group(1)), float(m.group(2))) if m else (0.0, 0.0)
        paths.append((attr(t, "fill"), bake(d, tx, ty)))

    kept = []
    for f, d in paths:
        bb = bbox(d)
        if bb is None:
            continue
        x0, y0, x1, y1 = bb
        if (x1 - x0) > 1000 and (y1 - y0) > 1000:  # drop full-canvas background
            continue
        kept.append((f, d))

    if not kept:
        raise RuntimeError(
            "%s: no drawable paths after filtering (trace produced nothing usable)" % inp
        )

    gx0 = min(bbox(d)[0] for _, d in kept)
    gy0 = min(bbox(d)[1] for _, d in kept)
    gx1 = max(bbox(d)[2] for _, d in kept)
    gy1 = max(bbox(d)[3] for _, d in kept)
    pad = 14
    gx0 -= pad; gy0 -= pad; gx1 += pad; gy1 += pad
    vw = round(gx1 - gx0, 1)
    vh = round(gy1 - gy0, 1)
    vb = [round(gx0, 1), round(gy0, 1), vw, vh]

    nodes = [(classify(f), d) for f, d in kept]

    js = "/** @schema 2.11 */\n"
    js += "const VB=%s;\n" % json.dumps(vb)
    js += "const W=pencil.width,H=pencil.height;\n"
    js += "const C={ink:%r,paper:%r,accent:%r};\n" % (INK, PAPER, ACC)
    js += "const P=%s;\n" % json.dumps(nodes)
    js += ('return P.map(function(p,i){return {type:"path",name:p[0]+i,'
           'x:0,y:0,width:W,height:H,viewBox:VB,geometry:p[1],fill:C[p[0]]};});\n')
    open(out_js, "w", encoding="utf-8").write(js)

    import os
    os.remove(svg)
    print("%s -> viewBox %s aspect %.3f layers %d %s bytes %d"
          % (out_js, vb, vw / vh, len(nodes), dict(Counter(c for c, _ in nodes)), len(js)))


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(
            "Usage: python _trace_to_js.py <input.png> <output.js> "
            "[color_precision] [layer_difference] [filter_speckle]",
            file=sys.stderr,
        )
        sys.exit(2)
    cp = int(sys.argv[3]) if len(sys.argv) > 3 else 5
    ld = int(sys.argv[4]) if len(sys.argv) > 4 else 32
    fs = int(sys.argv[5]) if len(sys.argv) > 5 else 16
    convert(sys.argv[1], sys.argv[2], cp, ld, fs)
