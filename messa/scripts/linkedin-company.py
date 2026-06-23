"""
LinkedIn Company Page assets for Alevizio.

Two outputs sized to LinkedIn's current spec:
  linkedin-company-logo.png   → 400×400, AV monogram in #1e1e1e on #dedbd1
                                (renders as the small square thumbnail next to
                                 every Experience entry that links to the Page)
  linkedin-company-cover.png  → 1128×191, tonal mesh + AV mark, brand-aligned
                                (the wide banner at the top of the Company Page)

Brand palette pulled from https://alevizio.com:
  --background : #dedbd1
  --foreground : #1e1e1e
"""

from __future__ import annotations

import math
import os
import random
import subprocess
import tempfile

import numpy as np
from PIL import Image, ImageFilter

BRAND_BG = (222, 219, 209)   # #dedbd1
BRAND_INK = (30, 30, 30)     # #1e1e1e

AV_SVG = (
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80.1162 53" fill="#1E1E1E">'
    '<path d="M50.7402 31.5898L63.1689 0H80.1162L59.2656 53H42.2148L29.5811 '
    '20.8867L22.2812 39.4414H31.2246L36.5654 53H0L20.8506 0H38.3125L50.7402 '
    '31.5898Z"/></svg>'
)


def rasterize_av_mark(target_height_px: int) -> Image.Image:
    """Use rsvg-convert to rasterize the AV monogram at a precise pixel size."""
    with tempfile.NamedTemporaryFile(suffix=".svg", delete=False) as f:
        f.write(AV_SVG.encode("utf-8"))
        svg_path = f.name
    png_path = svg_path.replace(".svg", ".png")
    subprocess.run(
        [
            "rsvg-convert",
            "-h", str(target_height_px * 2),
            "-o", png_path,
            svg_path,
        ],
        check=True,
    )
    img = Image.open(png_path).convert("RGBA")
    new_w = int(img.width / 2)
    new_h = int(img.height / 2)
    img = img.resize((new_w, new_h), Image.LANCZOS)
    os.unlink(svg_path)
    os.unlink(png_path)
    return img


# --------------------------------------------------------------------------
# Logo — 400x400 square
# --------------------------------------------------------------------------

def render_logo(seed: int = 7) -> Image.Image:
    """AV monogram on the bone background, centered, sized to read at small
    thumbnail sizes (48px and below). Subtle paper grain only — no decoration
    that would clutter a tiny rendering.
    """
    size = 400
    img = Image.new("RGB", (size, size), BRAND_BG)

    # Mark sized at ~62% of canvas height — large enough to be legible at 48px
    # but with comfortable whitespace at the larger Company Page rendering.
    mark_h = int(size * 0.62)
    mark = rasterize_av_mark(mark_h)
    x = (size - mark.width) // 2
    y = (size - mark.height) // 2
    img.paste(mark, (x, y), mark)

    # Whisper of paper grain — visible at full resolution, gone at thumbnail.
    grain_rng = np.random.default_rng(seed)
    grain = grain_rng.normal(0, 1.4, (size, size, 1)).astype(np.float32)
    arr = np.asarray(img, dtype=np.float32) + grain
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    return Image.fromarray(arr, mode="RGB")


# --------------------------------------------------------------------------
# Cover — 1128x191 wide banner
# --------------------------------------------------------------------------

COVER_W, COVER_H = 1128, 191
SUPERSAMPLE = 2

TONAL_BLOBS = [
    (235, 230, 220),
    (228, 222, 208),
    (210, 208, 200),
    (218, 213, 198),
    (200, 196, 184),
]


def render_cover_mesh(seed: int) -> np.ndarray:
    """Tonal gradient mesh tuned for the cover's 6:1 aspect ratio."""
    rng = random.Random(seed)
    w, h = COVER_W * SUPERSAMPLE, COVER_H * SUPERSAMPLE
    canvas = np.zeros((h, w, 3), dtype=np.float32)
    canvas[:, :] = np.array(BRAND_BG, dtype=np.float32)

    # Anchors weighted toward right (where the mark will sit) with calm left
    anchors = [
        (0.75, 0.30, 0.65, 0.80, 0),
        (0.90, 0.75, 0.50, 0.65, 1),
        (0.55, 0.50, 0.55, 0.50, 2),
        (0.30, 0.20, 0.45, 0.45, 3),
        (0.10, 0.80, 0.35, 0.35, 4),
    ]
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)
    for cxf, cyf, rf, intensity, ci in anchors:
        cx = (cxf + rng.uniform(-0.03, 0.03)) * COVER_W * SUPERSAMPLE
        cy = (cyf + rng.uniform(-0.025, 0.025)) * COVER_H * SUPERSAMPLE
        r = max(80.0, (rf + rng.uniform(-0.04, 0.04)) * COVER_H * 2.6) * SUPERSAMPLE
        dx = xs - cx
        dy = ys - cy
        d = np.sqrt((dx * dx) * 0.85 + (dy * dy) * 1.15)
        t = np.clip(d / r, 0.0, 1.0)
        falloff = (0.5 + 0.5 * np.cos(t * math.pi)) ** 1.3
        weight = (falloff * intensity * rng.uniform(0.92, 1.05))[..., None]
        color = np.array(TONAL_BLOBS[ci], dtype=np.float32)
        canvas = canvas + (color - canvas) * weight * 0.50

    return canvas


def render_cover(seed: int = 11) -> Image.Image:
    mesh = render_cover_mesh(seed)
    img = Image.fromarray(np.clip(mesh, 0, 255).astype(np.uint8), mode="RGB")
    img = img.filter(ImageFilter.GaussianBlur(radius=3 * SUPERSAMPLE))
    img = img.resize((COVER_W, COVER_H), Image.LANCZOS)

    # Grain
    grain_rng = np.random.default_rng(seed)
    grain = grain_rng.normal(0, 2.0, (COVER_H, COVER_W, 1)).astype(np.float32)
    arr = np.asarray(img, dtype=np.float32) + grain
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    img = Image.fromarray(arr, mode="RGB")

    # Mark — sized for the cover's compact height. LinkedIn Company Page
    # overlays the logo thumbnail on the lower-left of the cover, so we mirror
    # that and put the brand mark on the right side. Crop-safe at all widths.
    mark_h = int(COVER_H * 0.55)
    mark = rasterize_av_mark(mark_h)
    cx = int(COVER_W * 0.72)
    x = cx - mark.width // 2
    y = (COVER_H - mark.height) // 2
    img.paste(mark, (x, y), mark)
    return img


def main() -> None:
    out_dir = "/Users/alevizio/alevizio.com/public"
    os.makedirs(out_dir, exist_ok=True)

    logo = render_logo(seed=7)
    logo_path = os.path.join(out_dir, "linkedin-company-logo.png")
    logo.save(logo_path, "PNG", optimize=True)

    cover = render_cover(seed=11)
    cover_path = os.path.join(out_dir, "linkedin-company-cover.png")
    cover.save(cover_path, "PNG", optimize=True)

    for path in (logo_path, cover_path):
        size = os.path.getsize(path)
        with Image.open(path) as im:
            dims = im.size
        print(f"wrote {path}  ({dims[0]}x{dims[1]}, {size/1024:.1f} kB)")


if __name__ == "__main__":
    main()
