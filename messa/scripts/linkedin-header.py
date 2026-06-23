"""
LinkedIn header — aligned to the alevizio.com brand, with ASCII overlay.

Brand reference (from https://alevizio.com/):
  --background : #dedbd1   warm putty / bone (the dominant brand color)
  --foreground : #1e1e1e   warm near-black ink

Concept:
  Tonal gradient mesh in the bone family (atmosphere, not decoration) with an
  ASCII flow-field overlay rendered in #1e1e1e at low opacity. The characters
  trace a smooth Perlin-like noise field — like wind, currents, or contour
  lines made visible. Reads as designer-y intentional texture, not "hacker
  terminal". No logo.

  LinkedIn overlays a circular profile photo on the lower-left of the cover, so
  the composition keeps that quadrant sparse: density mask pulls the ASCII
  toward the right and upper portions of the image.

Outputs two variants:
  linkedin-header.png       → flow-field ASCII (default, topographic feel)
  linkedin-header-dots.png  → halftone dot scatter (softer, more atmospheric)
"""

from __future__ import annotations

import math
import os
import random
from dataclasses import dataclass

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

W, H = 1584, 396
SUPERSAMPLE = 2

BRAND_BG = (222, 219, 209)   # #dedbd1
BRAND_INK = (30, 30, 30)     # #1e1e1e

MONO_FONT = "/System/Library/Fonts/Menlo.ttc"

# Tonal palette — kept within the bone family so the mesh reads as paper
# mottling rather than color.
TONAL_BLOBS = [
    (235, 230, 220),  # cream lift
    (228, 222, 208),  # warm peach-shifted
    (210, 208, 200),  # cooler stone
    (200, 196, 184),  # deeper stone
    (218, 213, 198),  # mid-warm
    (180, 175, 162),  # warm shadow whisper
]


@dataclass
class Blob:
    cx: float
    cy: float
    radius: float
    color: tuple[int, int, int]
    intensity: float


def make_blobs(rng: random.Random) -> list[Blob]:
    anchors = [
        (0.72, 0.25, 0.55, 0.85, 0),
        (0.88, 0.70, 0.45, 0.65, 1),
        (0.55, 0.55, 0.50, 0.55, 2),
        (0.40, 0.15, 0.40, 0.50, 4),
        (0.20, 0.05, 0.30, 0.45, 0),
        (0.95, 0.95, 0.35, 0.60, 5),
        (0.65, 0.85, 0.30, 0.40, 3),
    ]
    blobs: list[Blob] = []
    for cxf, cyf, rf, intensity, ci in anchors:
        jx = rng.uniform(-0.03, 0.03)
        jy = rng.uniform(-0.025, 0.025)
        jr = rng.uniform(-0.04, 0.04)
        blobs.append(
            Blob(
                cx=(cxf + jx) * W,
                cy=(cyf + jy) * H,
                radius=max(80.0, (rf + jr) * H * 2.4),
                color=TONAL_BLOBS[ci],
                intensity=intensity * rng.uniform(0.92, 1.05),
            )
        )
    return blobs


def render_mesh(seed: int, blend_strength: float = 0.45) -> np.ndarray:
    rng = random.Random(seed)
    w, h = W * SUPERSAMPLE, H * SUPERSAMPLE

    canvas = np.zeros((h, w, 3), dtype=np.float32)
    canvas[:, :] = np.array(BRAND_BG, dtype=np.float32)

    blobs = make_blobs(rng)
    ys, xs = np.mgrid[0:h, 0:w].astype(np.float32)

    for b in blobs:
        cx = b.cx * SUPERSAMPLE
        cy = b.cy * SUPERSAMPLE
        r = b.radius * SUPERSAMPLE
        dx = xs - cx
        dy = ys - cy
        d2 = (dx * dx) * 0.85 + (dy * dy) * 1.15
        d = np.sqrt(d2)
        t = np.clip(d / r, 0.0, 1.0)
        falloff = 0.5 + 0.5 * np.cos(t * math.pi)
        falloff = falloff ** 1.3
        weight = (falloff * b.intensity)[..., None]
        color = np.array(b.color, dtype=np.float32)
        canvas = canvas + (color - canvas) * weight * blend_strength

    # Avatar calm zone — LinkedIn anchors the profile photo (~152px circle) at
    # the bottom-left of the cover, straddling the cover/profile boundary. We
    # extend a generous radial mask centered just below the bottom-left so the
    # area beneath AND around the avatar (its white halo, plus visual padding)
    # sits on near-pure brand bone.
    px = w * 0.10
    py = h * 0.95
    pr = h * 1.45
    md = np.sqrt((xs - px) ** 2 + (ys - py) ** 2)
    mt = np.clip(md / pr, 0.0, 1.0)
    mask = ((0.5 + 0.5 * np.cos(mt * math.pi)) ** 1.0)[..., None]
    bg_arr = np.array(BRAND_BG, dtype=np.float32)
    canvas = canvas * (1 - mask * 0.75) + bg_arr * (mask * 0.75)

    return canvas


# --------------------------------------------------------------------------
# Smooth noise field (value-noise via bilinear upsampling of a coarse RNG grid)
# --------------------------------------------------------------------------

def smooth_noise(shape: tuple[int, int], cell_size: int, seed: int) -> np.ndarray:
    """Generate a smooth 2D noise field in [0, 1]."""
    h, w = shape
    rng = np.random.default_rng(seed)
    coarse_h = h // cell_size + 2
    coarse_w = w // cell_size + 2
    coarse = rng.random((coarse_h, coarse_w)).astype(np.float32)
    # Upsample via PIL bilinear, then take the top-left region of size shape
    img = Image.fromarray((coarse * 255).astype(np.uint8))
    img = img.resize((coarse_w * cell_size, coarse_h * cell_size), Image.BILINEAR)
    arr = np.asarray(img, dtype=np.float32)[:h, :w] / 255.0
    # Soften a touch
    arr = np.asarray(
        Image.fromarray((arr * 255).astype(np.uint8)).filter(
            ImageFilter.GaussianBlur(radius=cell_size * 0.4)
        ),
        dtype=np.float32,
    ) / 255.0
    return arr


# --------------------------------------------------------------------------
# ASCII overlays
# --------------------------------------------------------------------------

# Box-drawing direction set, mapped to one of four bidirectional angles.
# (Index by quantized angle bin.)
FLOW_CHARS = ["─", "╱", "│", "╲"]
LOW_MAG_CHAR = "·"


def render_flow_overlay(
    seed: int,
    cell_w: int = 14,
    cell_h: int = 22,
    font_size: int = 20,
    base_alpha: int = 38,
) -> Image.Image:
    """Build an RGBA overlay of flow-field characters at 1x resolution."""
    font = ImageFont.truetype(MONO_FONT, font_size)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    # Two noise fields: one for direction, one for density modulation.
    # Sample at coarser scales so neighboring cells share direction (legible flow).
    dir_noise = smooth_noise((H, W), cell_size=80, seed=seed)
    den_noise = smooth_noise((H, W), cell_size=110, seed=seed + 1000)

    # Derive an angle from the noise gradient (so characters trace the gradient
    # of the noise scalar — a vector field). This gives smooth, organic flow
    # lines rather than uncorrelated per-cell directions.
    gy, gx = np.gradient(dir_noise)
    angle = np.arctan2(gy, gx)  # range [-pi, pi]
    magnitude = np.sqrt(gx * gx + gy * gy)
    # Normalize magnitude to [0, 1] for density modulation
    mag_norm = (magnitude - magnitude.min()) / (magnitude.max() - magnitude.min() + 1e-9)

    # Profile-photo calm mask — generous lower-left padding for the avatar.
    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    px = W * 0.10
    py = H * 0.95
    pr = H * 1.45
    md = np.sqrt((xs - px) ** 2 + (ys - py) ** 2)
    mt = np.clip(md / pr, 0.0, 1.0)
    calm = (0.5 + 0.5 * np.cos(mt * math.pi)) ** 1.0  # 1 in calm zone → 0 elsewhere

    rng = random.Random(seed + 2000)

    cols = W // cell_w
    rows = H // cell_h

    # Center the grid for even margins
    start_x = (W - cols * cell_w) // 2
    start_y = (H - rows * cell_h) // 2

    for row in range(rows):
        for col in range(cols):
            # Sample at the cell center
            x = start_x + col * cell_w + cell_w // 2
            y = start_y + row * cell_h + cell_h // 2
            if not (0 <= x < W and 0 <= y < H):
                continue

            a = angle[y, x]
            m = mag_norm[y, x]
            d = den_noise[y, x]
            c = calm[y, x]

            # Density probability — characters appear more in higher-density,
            # higher-magnitude areas; aggressively suppressed in the avatar
            # calm zone so the area under the profile photo stays pure bone.
            p = (0.55 + 0.45 * d) * (0.4 + 0.6 * m) * (1.0 - c * 0.98)
            if rng.random() > p:
                continue

            # Quantize angle into one of 4 bidirectional bins
            bidir = a % math.pi  # [0, pi)
            bin_idx = int((bidir / math.pi) * 4) % 4
            ch = FLOW_CHARS[bin_idx]

            # Some cells render the low-magnitude dot instead
            if m < 0.18 and rng.random() < 0.4:
                ch = LOW_MAG_CHAR

            # Alpha modulated by magnitude and density, attenuated by calm
            alpha = int(base_alpha * (0.5 + 0.7 * m) * (0.6 + 0.6 * d) * (1.0 - c * 0.95))
            alpha = max(0, min(255, alpha))
            if alpha < 6:
                continue

            # Slight horizontal jitter to break up perfect grid alignment
            jx = rng.randint(-1, 1)
            jy = rng.randint(-1, 1)

            draw.text(
                (x - cell_w // 2 + jx, y - cell_h // 2 + jy),
                ch,
                font=font,
                fill=(*BRAND_INK, alpha),
            )

    return overlay


def render_dot_overlay(
    seed: int,
    cell_w: int = 12,
    cell_h: int = 18,
    font_size: int = 16,
    base_alpha: int = 55,
) -> Image.Image:
    """Halftone-like dot scatter — softer, more atmospheric than the flow field."""
    font = ImageFont.truetype(MONO_FONT, font_size)
    overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)

    den = smooth_noise((H, W), cell_size=140, seed=seed)
    # Bias density toward the right
    grad = np.linspace(0.0, 1.0, W).astype(np.float32)[None, :].repeat(H, axis=0)
    den = den * 0.55 + grad * 0.45

    ys, xs = np.mgrid[0:H, 0:W].astype(np.float32)
    px = W * 0.10
    py = H * 0.95
    pr = H * 1.45
    md = np.sqrt((xs - px) ** 2 + (ys - py) ** 2)
    mt = np.clip(md / pr, 0.0, 1.0)
    calm = (0.5 + 0.5 * np.cos(mt * math.pi)) ** 1.0

    rng = random.Random(seed)
    cols = W // cell_w
    rows = H // cell_h
    start_x = (W - cols * cell_w) // 2
    start_y = (H - rows * cell_h) // 2

    glyphs = ["·", "∙", "•"]  # increasing weight
    for row in range(rows):
        for col in range(cols):
            x = start_x + col * cell_w + cell_w // 2
            y = start_y + row * cell_h + cell_h // 2
            if not (0 <= x < W and 0 <= y < H):
                continue
            d = den[y, x]
            c = calm[y, x]
            p = d * (1.0 - c * 0.98) * 0.85
            if rng.random() > p:
                continue
            # Heavier dot in denser regions
            if d > 0.78:
                ch = glyphs[2]
            elif d > 0.55:
                ch = glyphs[1]
            else:
                ch = glyphs[0]
            alpha = int(base_alpha * (0.5 + d) * (1.0 - c * 0.95))
            alpha = max(0, min(255, alpha))
            if alpha < 6:
                continue
            jx = rng.randint(-2, 2)
            jy = rng.randint(-2, 2)
            draw.text(
                (x - cell_w // 2 + jx, y - cell_h // 2 + jy),
                ch,
                font=font,
                fill=(*BRAND_INK, alpha),
            )

    return overlay


# --------------------------------------------------------------------------
# Compose
# --------------------------------------------------------------------------

def finish(canvas: np.ndarray, seed: int, grain_strength: float = 2.2) -> Image.Image:
    img = Image.fromarray(np.clip(canvas, 0, 255).astype(np.uint8), mode="RGB")
    img = img.filter(ImageFilter.GaussianBlur(radius=3 * SUPERSAMPLE))
    img = img.resize((W, H), Image.LANCZOS)

    grain_rng = np.random.default_rng(seed)
    grain = grain_rng.normal(0, grain_strength, (H, W, 1)).astype(np.float32)
    arr = np.asarray(img, dtype=np.float32) + grain
    arr = np.clip(arr, 0, 255).astype(np.uint8)
    return Image.fromarray(arr, mode="RGB")


def composite(base: Image.Image, overlay: Image.Image) -> Image.Image:
    base_rgba = base.convert("RGBA")
    return Image.alpha_composite(base_rgba, overlay).convert("RGB")


def main() -> None:
    out_dir = "/Users/alevizio/alevizio.com/public"
    os.makedirs(out_dir, exist_ok=True)

    # 1) Flow field — default
    mesh = render_mesh(seed=11, blend_strength=0.50)
    base = finish(mesh, seed=11, grain_strength=2.2)
    overlay = render_flow_overlay(seed=11)
    out = composite(base, overlay)
    out.save(os.path.join(out_dir, "linkedin-header.png"), "PNG", optimize=True)

    # 2) Dot halftone — alternate
    mesh = render_mesh(seed=11, blend_strength=0.50)
    base = finish(mesh, seed=11, grain_strength=2.2)
    overlay = render_dot_overlay(seed=23)
    out = composite(base, overlay)
    out.save(os.path.join(out_dir, "linkedin-header-dots.png"), "PNG", optimize=True)

    for name in ("linkedin-header.png", "linkedin-header-dots.png"):
        path = os.path.join(out_dir, name)
        size = os.path.getsize(path)
        print(f"wrote {path}  ({size/1024:.1f} kB)")


if __name__ == "__main__":
    main()
