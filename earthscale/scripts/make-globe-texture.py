# Builds src/assets/hero/world.webp, the globe's map: a seamless, full-sphere
# equirectangular texture from Earthscale's Web Mercator render of the world
# under a wind field (the hero studies in the Figma, exported at 1x as
# raw9.png), which covers longitudes -137 to 148 and latitudes -60.5 to 75.
# The projection was fitted on known coastlines (403 px per radian, Greenwich
# at x 964.5, the equator at row 817). The missing stretch of the Pacific is
# filled from reflections of the two edges, each reflection's sea covering
# the other's land, and the poles blend to the edge rows' colour.
#   python3 scripts/make-globe-texture.py <dir with raw9.png> src/assets/hero/world.webp
# Needs numpy and Pillow.
import math, sys
import numpy as np
from PIL import Image
S, OUT = sys.argv[1], sys.argv[2]
K, X0, R0 = 402.7, 964.5, 817.0
src = np.asarray(Image.open(f"{S}/raw9.png").convert("RGB")).astype(np.float32)
H_S, W_S = src.shape[:2]
LON_L = math.degrees(-X0 / K)            # left edge longitude
LON_R = math.degrees((W_S - 1 - X0) / K) # right edge longitude
def lat_of_row(r): return math.degrees(2*math.atan(math.exp((R0 - r)/K)) - math.pi/2)
LAT_T, LAT_B = lat_of_row(0), lat_of_row(H_S - 1)
print(f"source covers lon {LON_L:.1f}..{LON_R:.1f}, lat {LAT_B:.1f}..{LAT_T:.1f}")

# Land mask: the render paints land pink, red and purple-brown, ice white;
# sea teal, blue, green and purple. Measured: land has red over green by 20
# or more (the Amazon 57/29/73, Europe 63/41/81, Siberia 61/34/78), sea has
# green over red (the Atlantic 47/54/99, the Pacific 46/65/101).
r, g, b = src[..., 0], src[..., 1], src[..., 2]
land = ((r - g >= 14) & (r >= b * 0.62)) | ((r > 170) & (g > 170) & (b > 170))
# Feather it (box blur) so fills fade in.
def blur(m, n=10):
    a = m.astype(np.float32)
    k = np.ones(2*n+1, np.float32) / (2*n+1)
    a = np.apply_along_axis(lambda v: np.convolve(v, k, mode="same"), 1, a)
    a = np.apply_along_axis(lambda v: np.convolve(v, k, mode="same"), 0, a)
    return a
landf = blur(land)
# The sea's colour under the land: the sea blurred over the land, at three
# scales, the smallest that still reaches sea (a normalised convolution),
# so a masked coast takes the colour of the water around it.
sea = (~land).astype(np.float32)
def boxblur(a, n):
    k = np.ones(2*n+1, np.float32) / (2*n+1)
    a = np.apply_along_axis(lambda v: np.convolve(v, k, mode="same"), 1, a)
    return np.apply_along_axis(lambda v: np.convolve(v, k, mode="same"), 0, a)
seafill = np.zeros_like(src); have = np.zeros(src.shape[:2], bool)
for n in (60, 180, 500):
    wgt = boxblur(sea, n)
    col = np.stack([boxblur(src[..., c] * sea, n) for c in range(3)], axis=-1)
    ok = (wgt > 0.08) & ~have
    seafill[ok] = col[ok] / wgt[ok][..., None]
    have |= ok
seafill[~have] = src[sea > 0.5].mean(axis=0)

def bilerp(img, xs, ys):
    x0 = np.floor(xs).astype(int); y0 = np.floor(ys).astype(int)
    fx = xs - x0; fy = ys - y0
    if img.ndim == 3: fx = fx[..., None]; fy = fy[..., None]
    return img[y0, x0] * (1-fx) * (1-fy) + img[y0, x0+1] * fx * (1-fy) + img[y0+1, x0] * (1-fx) * fy + img[y0+1, x0+1] * fx * fy

def sample(xs, ys):
    """Bilinear samples of the source, of the feathered land mask and of the sea fill, at float coords (clamped)."""
    xs = np.clip(xs, 0, W_S - 1.001); ys = np.clip(ys, 0, H_S - 1.001)
    return bilerp(src, xs, ys), bilerp(landf, xs, ys), bilerp(seafill, xs, ys)

W, H = 4096, 2048
lon = (np.arange(W) + 0.5) / W * 360 - 180
lat = 90 - (np.arange(H) + 0.5) / H * 180
LON, LAT = np.meshgrid(lon, lat)
def merc_row(latd):
    latc = np.clip(latd, LAT_B, LAT_T)
    return R0 - K * np.log(np.tan(np.pi/4 + np.radians(latc)/2))
def merc_col(lond):
    return X0 + K * np.radians(lond)
smooth = lambda a, b, x: np.clip((x - a) / (b - a), 0, 1) ** 2 * (3 - 2 * np.clip((x - a) / (b - a), 0, 1))

# 1. Inside the covered longitudes: straight resample (rows clamped at the caps).
rows = merc_row(LAT)
inside = (LON >= LON_L) & (LON <= LON_R)
colS = np.where(inside, merc_col(LON), 0)
out, _, _ = sample(colS, rows)
# 2. The longitude gap, east of the right edge round to the left edge.
GAP = (LON_L + 360) - LON_R
gpos = np.where(LON > LON_R, LON - LON_R, LON - LON_R + 360)  # degrees into the gap from the right edge
gp = np.clip(gpos / GAP, 0, 1)
STRETCH = 0.6
lonA = LON_R - gpos * STRETCH          # reflected from the right edge
lonB = LON_L + (GAP - gpos) * STRETCH  # reflected from the left edge
A, lA, sA = sample(merc_col(lonA), rows)
B, lB, sB = sample(merc_col(lonB), rows)
# Below 50N the gap is the open Pacific: where one reflection shows land the
# other's sea takes over, and where both do, the sea around them.
pacific = LAT < 50
lA = np.where(pacific, lA, 0); lB = np.where(pacific, lB, 0)
w = smooth(0.35, 0.65, gp)
# Each reflection owns its half of the gap, and where it shows land the
# other's sea takes that spot over, whichever half it is in.
wA = (1 - lA) * ((1 - w) + lB * w); wB = (1 - lB) * (w + lA * (1 - w))
tot = wA + wB
seas = sA * (1 - w)[..., None] + sB * w[..., None]
mixed = (A * wA[..., None] + B * wB[..., None]) / np.maximum(tot, 1e-6)[..., None]
k = np.clip(tot / 0.25, 0, 1)[..., None]
gapfill = seas * (1 - k) + mixed * k
# The reflections are stretched, so soften them a little; the blur wraps
# round the date line, which runs through the gap.
def blur_wrap(a, n):
    kk = np.ones(2*n+1, np.float32) / (2*n+1)
    padded = np.concatenate([a[:, -n:], a, a[:, :n]], axis=1)
    a = np.apply_along_axis(lambda v: np.convolve(v, kk, mode="valid"), 1, padded)
    padded = np.concatenate([np.repeat(a[:1], n, axis=0), a, np.repeat(a[-1:], n, axis=0)], axis=0)
    return np.apply_along_axis(lambda v: np.convolve(v, kk, mode="valid"), 0, padded)
gapfill = np.stack([blur_wrap(gapfill[..., c], 3) for c in range(3)], axis=-1)
out = np.where(inside[..., None], out, gapfill)
# 3. The caps: past the map's top and bottom the edge row would smear into
# stripes, so the edge blends over four degrees into its own colour averaged
# along the parallel (a wide, wrapping blur), then over twelve more into
# the mean, which the pole wears.
def cap(edge_lat, inward, far):
    band = (LAT <= max(edge_lat, edge_lat + inward)) & (LAT >= min(edge_lat, edge_lat + inward))
    rowsel = np.where(band.any(axis=1))[0]
    strip = out[rowsel].mean(axis=0)  # per longitude, the colour just inside the edge
    k = np.ones(361, np.float32) / 361
    blurred = np.stack([np.convolve(np.concatenate([strip[-180:, c], strip[:, c], strip[:180, c]]), k, mode="valid") for c in range(3)], axis=1)
    mean = strip.mean(axis=0)
    t1 = smooth(edge_lat, edge_lat - inward, LAT)[..., None]
    t2 = smooth(edge_lat - inward, far, LAT)[..., None]
    return blurred[None, :, :], mean, t1, t2
blurred, mean, t1, t2 = cap(LAT_T, -4, LAT_T + 16)
out = out * (1 - t1) + blurred * t1
out = out * (1 - t2) + mean * t2
blurred, mean, t1, t2 = cap(LAT_B, 4, LAT_B - 16)
out = out * (1 - t1) + blurred * t1
out = out * (1 - t2) + mean * t2
img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
img.save(OUT, "WEBP", quality=82, method=6)
print("texture written", img.size)
