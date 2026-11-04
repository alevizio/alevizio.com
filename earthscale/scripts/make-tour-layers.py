"""The page tour's live layers, from the landing page's Figma (KU9Nf2lzET4zNfw6LizAT6).

The tour (tour-page.tsx) plays the page in pieces where the file has them
in pieces: the hero's planet and the closing globe turn, the explorer's map
runs through its time steps under its panels, and the panels come in over
it. This cuts those pieces out of the file's own renders.

Inputs, in one folder (the first argument), from the Figma MCP:
  planet.png      the hero's globe, Globe 10:1878's source picture (1024 square)
  footer.png      the footer's globe screenshot, 10:2133's source (4096 x 2332)
  map.gif         the explorer's map, 10:2021's source (19 frames, 1536 x 864)
  controls.png    the panels at 2x: Map Controls 10:2025, the visualization
  edit.png          GUI 10:2023, Sub Menu 10:2024 and the pixel GUI 10:2022
  menu.png
  pixel.png
and the page's own sheets in src/assets/page/anat.

Writes src/assets/page/tour/*.webp and prints the numbers the tour uses.
Run: uv run --with pillow --with numpy --with opencv-python-headless \
       python scripts/make-tour-layers.py <folder>
"""

import json
import sys
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

SRC = Path(sys.argv[1])
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "src/assets/page/tour"
OUT.mkdir(parents=True, exist_ok=True)


def fit_circle(xs, ys, rounds=5):
    """A least squares circle through edge points, dropping the strays."""
    keep = np.ones(len(xs), bool)
    for _ in range(rounds):
        a = np.c_[2 * xs[keep], 2 * ys[keep], np.ones(keep.sum())]
        c = np.linalg.lstsq(a, xs[keep] ** 2 + ys[keep] ** 2, rcond=None)[0]
        cx, cy = c[0], c[1]
        r = np.sqrt(c[2] + cx**2 + cy**2)
        res = np.hypot(xs - cx, ys - cy) - r
        keep = np.abs(res) < 2.5 * res[keep].std() + 0.5
    return cx, cy, r


def limb(mask, guess, r_from, r_to):
    """Where a disc's mask ends along rays out of a guess at its centre."""
    h, w = mask.shape
    xs, ys = [], []
    for a in np.linspace(0, 2 * np.pi, 1440, endpoint=False):
        dx, dy = np.cos(a), np.sin(a)
        last = None
        for r in np.arange(r_from, r_to, 0.5):
            x, y = guess[0] + dx * r, guess[1] + dy * r
            if not (0 <= x < w - 1 and 0 <= y < h - 1):
                last = None
                break
            if mask[int(round(y)), int(round(x))]:
                last = (x, y)
        if last:
            xs.append(last[0])
            ys.append(last[1])
    return fit_circle(np.array(xs), np.array(ys))


def save(img, name, quality=82, lossless=False):
    Image.fromarray(img).save(OUT / name, "WEBP", quality=quality, method=6, lossless=lossless)
    print(f"  {name} {img.shape[1]}x{img.shape[0]} {(OUT / name).stat().st_size // 1024} KB")


# The hero's planet: its picture cropped square about the disc the file
# shows of it. Globe 10:1878 sets the picture at 1.506 from (-57, -63) and
# cuts it to a circle 712.43 across the middle of its 1425 px (both fitted
# to the file's export of it), inside the picture's own dark rim.
planet = np.asarray(Image.open(SRC / "planet.png").convert("RGB"))
cx, cy, r = (711.75 + 57) / 1.506, (711.88 + 63) / 1.506, 712.43 / 1.506
half = int(np.ceil(r)) + 3
x0, y0 = int(round(cx)) - half, int(round(cy)) - half
disc = planet[y0 : y0 + 2 * half, x0 : x0 + 2 * half]
print(f"planet disc: centre {cx:.1f},{cy:.1f} r {r:.1f}; crop {2 * half} square, radius {r / half:.4f} of its half")
print(f"  centre offset in the crop {cx - x0 - half:+.2f},{cy - y0 - half:+.2f} px")
save(disc, "planet-disc.webp", 86)

# The footer: the product's globe screenshot at 1.18 from (-1696, -413) in
# the footer's 1440 x 668 (fitted to the page's own render), under a
# treatment the file gives it. The treatment is fitted here, colour by
# colour and across the frame, away from the text, and drawn the same way
# by the tour's shader, so the globe can turn under it.
sheet = np.asarray(Image.open(ROOT / "src/assets/page/anat/07-ask.webp").convert("RGB").resize((1440, 668), Image.LANCZOS)).astype(np.float32) / 255
raw = np.asarray(Image.open(SRC / "footer.png").convert("RGB")).astype(np.float32) / 255
S, X0, Y0 = 1.18, -1696, -413
big = cv2.resize(raw, (round(raw.shape[1] * S), round(raw.shape[0] * S)), interpolation=cv2.INTER_AREA)
under = big[-Y0 : -Y0 + 668, -X0 : -X0 + 1440]
text = np.ones((668, 1440), bool)
for a, b, c, d in [(200, 110, 1240, 240), (620, 250, 820, 320), (70, 505, 270, 560), (70, 570, 320, 600), (930, 490, 1110, 535), (930, 535, 1370, 615)]:
    text[b:d, a:c] = False
yy, xx = np.mgrid[0:668, 0:1440].astype(np.float32)


def colour_terms(c):
    r, g, b = c[..., 0], c[..., 1], c[..., 2]
    return np.stack([np.ones_like(r), r, g, b, r * r, g * g, b * b, r * g, g * b, r * b, r * r * r, g * g * g, b * b * b], -1)


def place_terms(x, y):
    xn, yn = (x - 720) / 720, y / 668
    return np.stack([xn, yn, xn * xn, yn * yn, xn * yn, np.abs(xn)], -1)


terms = np.concatenate([colour_terms(under), place_terms(xx, yy)], -1)
weights = np.linalg.lstsq(terms[text], sheet[text], rcond=None)[0]
treated = np.clip(terms @ weights, 0, 1)
print(f"footer treatment: mean error {np.abs(treated - sheet)[text].mean() * 255:.2f} of 255")
bg = cv2.resize(treated, (2048, 950), interpolation=cv2.INTER_CUBIC)
save((bg * 255 + 0.5).astype(np.uint8), "ask-bg.webp", 84)

# The globe in the screenshot: teal and green against its white halo and
# the navy sky (OpenCV's hues, 0 to 180), its top at about 447 in the
# footer, its middle below the footer's foot.
hsv = cv2.cvtColor((raw * 255).astype(np.uint8), cv2.COLOR_RGB2HSV)
gx, gy = (720 - X0) / S, (447 - Y0) / S + 467
fcx, fcy, fr = limb((hsv[..., 1] > 60) & (hsv[..., 0] < 104), (gx, gy), 300, 600)
fhalf = int(np.ceil(fr)) + 3
fx0, fy0 = int(round(fcx)) - fhalf, int(round(fcy)) - fhalf
fdisc = (raw[fy0 : fy0 + 2 * fhalf, fx0 : fx0 + 2 * fhalf] * 255 + 0.5).astype(np.uint8)
print(f"footer disc: centre {X0 + fcx * S:.1f},{Y0 + fcy * S:.1f} r {fr * S:.1f} in the footer; crop {2 * fhalf} square, radius {fr / fhalf:.4f}")
print(f"  centre offset in the crop {fcx - fx0 - fhalf:+.2f},{fcy - fy0 - fhalf:+.2f} px")
save(fdisc, "ask-disc.webp", 86)
print("  treatment weights (rows: 1 r g b r2 g2 b2 rg gb rb r3 g3 b3 | xn yn xn2 yn2 xnyn |xn|; columns r g b):")
print(json.dumps(np.round(weights, 5).tolist()))

# The explorer's map: the first half of the GIF (it runs forward, then
# back), at 0.99 from (-158, -40) in the 1280 x 820 container (fitted to
# the file's render of it, the browser's bar just off the top), down to
# where the page's fade has covered it.
gif = Image.open(SRC / "map.gif")
for i in range(10):
    gif.seek(i)
    frame = gif.convert("RGB")
    frame = frame.resize((round(1536 * 0.99), round(864 * 0.99)), Image.LANCZOS)
    canvas = Image.new("RGB", (1280, 725))
    canvas.paste(frame, (-158, -40))
    save(np.asarray(canvas), f"map-{i}.webp", 72)

# The panels, lifted off the export's background (colour to alpha), so the
# tour can lay them on glass over the moving map. Each sits at 2x, its node
# 78, 16 into the export (the rest is the shadow's room).
for name in ["controls", "edit", "menu", "pixel"]:
    im = np.asarray(Image.open(SRC / f"{name}.png").convert("RGB")).astype(np.float32) / 255
    base = np.median(np.r_[im[:4].reshape(-1, 3), im[:, :4].reshape(-1, 3)], 0)
    up = np.where(im > base, (im - base) / np.maximum(1 - base, 1e-3), 0)
    down = np.where(im < base, (base - im) / np.maximum(base, 1e-3), 0)
    alpha = np.maximum(up, down).max(-1, keepdims=True)
    colour = np.where(alpha > 1e-3, (im - base) / np.maximum(alpha, 1e-3) + base, 0)
    rgba = np.concatenate([np.clip(colour, 0, 1), alpha], -1)
    if name == "controls":
        # The time slider is drawn live, in step with the map: what was
        # under it is the panel's own faint fill, as in the row above.
        rgba[354:382, 218:518] = rgba[346, 300]
    save((rgba * 255 + 0.5).astype(np.uint8), f"panel-{name}.webp", 88)
    print(f"  {name}: export {im.shape[1]}x{im.shape[0]}, background {np.round(base * 255, 1).tolist()}")

# The explorer's sheet with the panels' edges off it: where a panel (and
# its shadow) runs past the map, the page's own colour row by row, so the
# panels can come in over the live map without leaving a ghost. In file px
# of the section: left of the map beside the layers panel, and above the
# map over the pixel panel.
sheet = np.asarray(Image.open(ROOT / "src/assets/page/anat/05-explore.webp").convert("RGB")).copy()
k = sheet.shape[1] / 1440
for (x0, y0, x1, y1, src) in [(0, 440, 80, 990, 2), (1015, 296, 1395, 386, 1000)]:
    ys = slice(round(y0 * k), round(y1 * k))
    sheet[ys, round(x0 * k) : round(x1 * k)] = sheet[ys, round(src * k) : round(src * k) + 1]
save(sheet, "explore-base.webp", 86)

# The serve sheet with its tile source's window off it, and the window on
# its own, so the tour can bring the window in when the comet reaches it.
# In file px of the section: the window and its edge, the page's own
# colour row by row in its place.
sheet = np.asarray(Image.open(ROOT / "src/assets/page/anat/04-serve.webp").convert("RGB")).copy()
k = sheet.shape[1] / 1440
x0, y0, x1, y1 = (round(v * k) for v in (830, 838, 1410, 1124))
save(sheet[y0:y1, x0:x1].copy(), "serve-tiles.webp", 88)
sheet[y0:y1, x0:x1] = sheet[y0:y1, round(822 * k) : round(822 * k) + 1]
save(sheet, "serve-base.webp", 86)
