#!/usr/bin/env python3
"""
Asset helpers for crisp slides (needs Pillow: pip install pillow).

  crop      Cut the part of a screenshot that matters at NATIVE pixels (→ shows 1:1 on the slide).
            python assets.py crop in.png out.png --box X Y W H [--size W H] [--blur X Y W H ...]
            --size resizes with Lanczos (only shrink a little, ≤15%); --blur hides emails/URLs/keys.

  portrait  Fill a 9:16 card from any photo (centre crop, Lanczos).
            python assets.py portrait in.jpg out.jpg [--w 900]

  logo      Turn a dark logo with transparency into a white (or any colour) cutout, trimmed to its bounds.
            python assets.py logo in.png out.png [--color ffffff] [--pad 10]

  resize    Pre-resize for the size it's shown at ×2 (sharp on retina, no browser downscaling mush).
            python assets.py resize in.png out.jpg --w 560

  sheet     Contact sheet of several images to eyeball them quickly.
            python assets.py sheet out.jpg a.png b.png c.png [--h 300]
"""
import argparse
import sys

from PIL import Image, ImageFilter

# Windows consoles default to cp1252; keep ✓/× printable everywhere.
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8', errors='replace')


def crop(a):
    im = Image.open(a.src)
    x, y, w, h = a.box
    if a.blur:
        for i in range(0, len(a.blur), 4):
            bx, by, bw, bh = a.blur[i : i + 4]
            region = im.crop((bx, by, bx + bw, by + bh)).filter(ImageFilter.GaussianBlur(10))
            im.paste(region, (bx, by))
    out = im.crop((x, y, x + w, y + h))
    if a.size:
        out = out.resize(tuple(a.size), Image.LANCZOS)
    out.save(a.dst)
    print(f"✓ {a.dst} {out.size[0]}×{out.size[1]} → use w={out.size[0]} h={out.size[1]} on the slide")


def portrait(a):
    im = Image.open(a.src).convert("RGB")
    w = a.w
    h = round(w * 16 / 9)
    sw, sh = im.size
    scale = max(w / sw, h / sh)
    im = im.resize((round(sw * scale), round(sh * scale)), Image.LANCZOS)
    left = (im.size[0] - w) // 2
    top = (im.size[1] - h) // 2
    im.crop((left, top, left + w, top + h)).save(a.dst, quality=92)
    print(f"✓ {a.dst} {w}×{h}")


def logo(a):
    im = Image.open(a.src).convert("RGBA")
    alpha = im.getchannel("A")
    bbox = alpha.point(lambda v: 255 if v > 20 else 0).getbbox()
    if not bbox:
        sys.exit("✗ no opaque pixels — the logo needs a transparent background")
    rgb = tuple(int(a.color[i : i + 2], 16) for i in (0, 2, 4))
    solid = Image.new("RGBA", im.size, rgb + (255,))
    solid.putalpha(alpha)
    p = a.pad
    out = solid.crop((max(0, bbox[0] - p), max(0, bbox[1] - p), bbox[2] + p, bbox[3] + p))
    out.save(a.dst)
    print(f"✓ {a.dst} {out.size[0]}×{out.size[1]}")


def resize(a):
    im = Image.open(a.src)
    h = round(im.size[1] * a.w / im.size[0])
    im = im.resize((a.w, h), Image.LANCZOS)
    if a.dst.lower().endswith((".jpg", ".jpeg")):
        im = im.convert("RGB")
        im.save(a.dst, quality=90)
    else:
        im.save(a.dst)
    print(f"✓ {a.dst} {a.w}×{h}")


def sheet(a):
    ims = [Image.open(p).convert("RGB") for p in a.srcs]
    ims = [i.resize((round(i.size[0] * a.h / i.size[1]), a.h), Image.LANCZOS) for i in ims]
    out = Image.new("RGB", (sum(i.size[0] for i in ims), a.h), "black")
    x = 0
    for i in ims:
        out.paste(i, (x, 0))
        x += i.size[0]
    out.save(a.dst, quality=85)
    print(f"✓ {a.dst}")


p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
sub = p.add_subparsers(dest="cmd", required=True)
c = sub.add_parser("crop"); c.add_argument("src"); c.add_argument("dst"); c.add_argument("--box", type=int, nargs=4, required=True); c.add_argument("--size", type=int, nargs=2); c.add_argument("--blur", type=int, nargs="+"); c.set_defaults(fn=crop)
c = sub.add_parser("portrait"); c.add_argument("src"); c.add_argument("dst"); c.add_argument("--w", type=int, default=900); c.set_defaults(fn=portrait)
c = sub.add_parser("logo"); c.add_argument("src"); c.add_argument("dst"); c.add_argument("--color", default="ffffff"); c.add_argument("--pad", type=int, default=10); c.set_defaults(fn=logo)
c = sub.add_parser("resize"); c.add_argument("src"); c.add_argument("dst"); c.add_argument("--w", type=int, required=True); c.set_defaults(fn=resize)
c = sub.add_parser("sheet"); c.add_argument("dst"); c.add_argument("srcs", nargs="+"); c.add_argument("--h", type=int, default=300); c.set_defaults(fn=sheet)
args = p.parse_args()
args.fn(args)
