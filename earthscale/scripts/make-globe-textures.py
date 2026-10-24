# Builds the globe's maps from Earthscale's two world renders in the Figma
# (the hero studies, exported at 1x): the world under a 10 m wind field in
# viridis (raw9.png, 2006 x 1356) and under 2 m temperature in plasma
# (raw12.png, 2296 x 1450). Both are Web Mercator crops; their projections
# were fitted on known coastlines. For each, the render is split into the
# data field (where along its ramp each pixel sits) and the imagery under it
# (what is left once the ramp's colour is taken away), so the page can set
# the field in any of the product's five ramps and still get the render back
# exactly in its own. Each is resampled to a seamless, full-sphere
# equirectangular map, 4096 by 2048: the missing stretch of the Pacific is
# filled from reflections of the two edges, each reflection's sea covering
# the other's land, and the poles blend to the edge rows' colour.
#   python3 scripts/make-globe-textures.py <dir with raw9.png, raw12.png, ramps.npy> <out dir>
# Needs numpy and Pillow; ramps.npy comes from make-lut.py (matplotlib).
import math, sys
import numpy as np
from PIL import Image

S, OUT = sys.argv[1], sys.argv[2]
LUT = np.load(f"{S}/ramps.npy")  # 5 x 256 x 3, 0..255
# 4096 wide, with the last and first 26 columns repeated at either end, so
# the seam sits inside continuous encoded data and, at column 26, in the
# middle of a 4 by 4 transform block and a 16 by 16 macroblock: a lossy
# encoder's border, and its block edges, each showed as a line down the
# Pacific. The shader reads the inner span.
PAD = 26
W, H = 4096 - 2 * PAD, 2048
smooth = lambda a, b, x: np.clip((x - a) / (b - a), 0, 1) ** 2 * (3 - 2 * np.clip((x - a) / (b - a), 0, 1))

def boxblur(a, n):
    k = np.ones(2*n+1, np.float32) / (2*n+1)
    a = np.apply_along_axis(lambda v: np.convolve(v, k, mode="same"), 1, a)
    return np.apply_along_axis(lambda v: np.convolve(v, k, mode="same"), 0, a)

def blur_wrap(a, n):
    kk = np.ones(2*n+1, np.float32) / (2*n+1)
    padded = np.concatenate([a[:, -n:], a, a[:, :n]], axis=1)
    a = np.apply_along_axis(lambda v: np.convolve(v, kk, mode="valid"), 1, padded)
    padded = np.concatenate([np.repeat(a[:1], n, axis=0), a, np.repeat(a[-1:], n, axis=0)], axis=0)
    return np.apply_along_axis(lambda v: np.convolve(v, kk, mode="valid"), 0, padded)

def bilerp(img, xs, ys):
    x0 = np.floor(xs).astype(int); y0 = np.floor(ys).astype(int)
    fx = xs - x0; fy = ys - y0
    if img.ndim == 3: fx = fx[..., None]; fy = fy[..., None]
    return img[y0, x0] * (1-fx) * (1-fy) + img[y0, x0+1] * fx * (1-fy) + img[y0+1, x0] * (1-fx) * fy + img[y0+1, x0+1] * fx * fy

def invert_ramp(src, ramp):
    """Where along the ramp each pixel sits, by the direction of its colour
    (the imagery under the ramp darkens it but hardly turns it), 0..1."""
    lut = LUT[ramp]
    lutn = lut / np.maximum(np.linalg.norm(lut, axis=1, keepdims=True), 1e-6)
    s = np.zeros(src.shape[:2], np.float32)
    for y0 in range(0, src.shape[0], 64):
        block = src[y0:y0+64].reshape(-1, 3)
        bn = block / np.maximum(np.linalg.norm(block, axis=1, keepdims=True), 1e-6)
        best = np.argmax(bn @ lutn.T, axis=1)
        s[y0:y0+64] = (best / 255.0).reshape(-1, src.shape[1])
    return boxblur(s, 1)

def closed(mask, n=12):
    """The mask with its small holes filled: grown, then shrunk back."""
    grown = boxblur(mask.astype(np.float32), n) > 0.25
    return boxblur(grown.astype(np.float32), n) > 0.75

def land_by_colour(src):
    # The wind render paints land pink, red and purple-brown, ice white; sea
    # teal, blue, green and purple: land has red over green by 14 or more.
    r, g, b = src[..., 0], src[..., 1], src[..., 2]
    return closed(((r - g >= 14) & (r >= b * 0.62)) | ((r > 170) & (g > 170) & (b > 170)))

# The wind render's land, kept to lend to the temperature render below.
WIND = {}

def land_by_texture(src):
    # The temperature render's land is imagery, textured; its sea is the
    # smooth ramp. Land where the luminance varies over a small window;
    # that marks coasts and relief but not flat interiors, so the wind
    # render's land, reprojected, fills those in.
    lum = src.mean(axis=2)
    mean = boxblur(lum, 3); sq = boxblur(lum * lum, 3)
    std = np.sqrt(np.maximum(sq - mean * mean, 0))
    rough = boxblur((std > 2.2).astype(np.float32), 4) > 0.35
    H_S, W_S = src.shape[:2]
    K, X0, R0 = 462.0, 955.7, 1100.6
    ys, xs = np.mgrid[0:H_S, 0:W_S]
    lon = (xs - X0) / K
    lat = 2 * np.arctan(np.exp((R0 - ys) / K)) - np.pi / 2
    wk, wx0, wr0, wland = WIND["K"], WIND["X0"], WIND["R0"], WIND["land"]
    wx = wx0 + wk * lon; wy = wr0 - wk * np.log(np.tan(np.pi / 4 + lat / 2))
    inside = (wx >= 0) & (wx <= wland.shape[1] - 1) & (wy >= 0) & (wy <= wland.shape[0] - 1)
    lent = np.zeros((H_S, W_S), bool)
    lent[inside] = wland[np.clip(wy[inside].round().astype(int), 0, wland.shape[0] - 1), np.clip(wx[inside].round().astype(int), 0, wland.shape[1] - 1)]
    return closed(rough | lent)

def build(name, filename, K, X0, R0, ramp, land_of, polar=None):
    """polar: where along the ramp the poles sit, when the data says (the
    temperature's poles are cold, the ramp's low end); None takes the mean
    of the edge."""
    src = np.asarray(Image.open(f"{S}/{filename}").convert("RGB")).astype(np.float32)
    H_S, W_S = src.shape[:2]
    LON_L = math.degrees(-X0 / K); LON_R = math.degrees((W_S - 1 - X0) / K)
    lat_of_row = lambda r: math.degrees(2*math.atan(math.exp((R0 - r)/K)) - math.pi/2)
    LAT_T, LAT_B = lat_of_row(0), lat_of_row(H_S - 1)
    print(f"{name}: lon {LON_L:.1f}..{LON_R:.1f}, lat {LAT_B:.1f}..{LAT_T:.1f}")

    # The field and the imagery under it. Taking the ramp's colour back
    # from the field gives the render exactly.
    field = invert_ramp(src, ramp)
    under = src - LUT[ramp][np.clip((field * 255).round().astype(int), 0, 255)]
    layers = np.concatenate([field[..., None], under], axis=-1)  # H x W x 4

    land = land_of(src)
    if name == "wind": WIND.update(K=K, X0=X0, R0=R0, land=land)
    Image.fromarray((land * 255).astype(np.uint8)).resize((W_S // 2, H_S // 2)).save(f"{S}/land-{name}.png")
    landf = boxblur(land.astype(np.float32), 10)
    sea = (~land).astype(np.float32)
    # The layers of the sea under the land, at three scales, the smallest
    # that still reaches sea, so a masked coast takes the water around it.
    seafill = np.zeros_like(layers); have = np.zeros(src.shape[:2], bool)
    for n in (60, 180, 500):
        wgt = boxblur(sea, n)
        col = np.stack([boxblur(layers[..., c] * sea, n) for c in range(4)], axis=-1)
        ok = (wgt > 0.08) & ~have
        seafill[ok] = col[ok] / wgt[ok][..., None]
        have |= ok
    seafill[~have] = layers[sea > 0.5].mean(axis=0)

    def sample(xs, ys):
        xs = np.clip(xs, 0, W_S - 1.001); ys = np.clip(ys, 0, H_S - 1.001)
        return bilerp(layers, xs, ys), bilerp(landf, xs, ys), bilerp(seafill, xs, ys)

    lon = (np.arange(W) + 0.5) / W * 360 - 180
    lat = 90 - (np.arange(H) + 0.5) / H * 180
    LON, LAT = np.meshgrid(lon, lat)
    merc_row = lambda latd: R0 - K * np.log(np.tan(np.pi/4 + np.radians(np.clip(latd, LAT_B, LAT_T))/2))
    merc_col = lambda lond: X0 + K * np.radians(lond)

    rows = merc_row(LAT)
    inside = (LON >= LON_L) & (LON <= LON_R)
    out, _, _ = sample(np.where(inside, merc_col(LON), 0), rows)

    GAP = (LON_L + 360) - LON_R
    gpos = np.where(LON > LON_R, LON - LON_R, LON - LON_R + 360)
    gp = np.clip(gpos / GAP, 0, 1)
    STRETCH = 0.6
    A, lA, sA = sample(merc_col(LON_R - gpos * STRETCH), rows)
    B, lB, sB = sample(merc_col(LON_L + (GAP - gpos) * STRETCH), rows)
    pacific = LAT < 50
    lA = np.where(pacific, lA, 0); lB = np.where(pacific, lB, 0)
    w = smooth(0.35, 0.65, gp)
    wA = (1 - lA) * ((1 - w) + lB * w); wB = (1 - lB) * (w + lA * (1 - w))
    tot = wA + wB
    seas = sA * (1 - w)[..., None] + sB * w[..., None]
    mixed = (A * wA[..., None] + B * wB[..., None]) / np.maximum(tot, 1e-6)[..., None]
    k = np.clip(tot / 0.25, 0, 1)[..., None]
    gapfill = seas * (1 - k) + mixed * k
    gapfill = np.stack([blur_wrap(gapfill[..., c], 3) for c in range(4)], axis=-1)
    out = np.where(inside[..., None], out, gapfill)

    def cap(edge_lat, inward, far):
        band = (LAT <= max(edge_lat, edge_lat + inward)) & (LAT >= min(edge_lat, edge_lat + inward))
        rowsel = np.where(band.any(axis=1))[0]
        strip = out[rowsel].mean(axis=0)
        kk = np.ones(361, np.float32) / 361
        blurred = np.stack([np.convolve(np.concatenate([strip[-180:, c], strip[:, c], strip[:180, c]]), kk, mode="valid") for c in range(4)], axis=1)
        mean = strip.mean(axis=0)
        if polar is not None: mean[0] = polar
        return blurred[None], mean, smooth(edge_lat, edge_lat - inward, LAT)[..., None], smooth(edge_lat - inward, far, LAT)[..., None]
    # Toward a cold pole the field eases over a wider band, so the south,
    # which the temperature render leaves at 40 degrees, cools gradually.
    for edge, inward, far in ((LAT_T, -4, LAT_T + 16), (LAT_B, 4, LAT_B - (36 if polar is not None else 16))):
        blurred, mean, t1, t2 = cap(edge, inward, far)
        out = out * (1 - t1) + blurred * t1
        out = out * (1 - t2) + mean * t2

    out = np.concatenate([out[:, -PAD:], out, out[:, :PAD]], axis=1)
    field = np.clip(out[..., 0] * 255, 0, 255).astype(np.uint8)
    under = np.clip(out[..., 1:] / 2 + 128, 0, 255).astype(np.uint8)
    Image.fromarray(np.repeat(field[..., None], 3, axis=-1)).save(f"{OUT}/world-{name}-field.webp", "WEBP", quality=90, method=6)
    Image.fromarray(under).save(f"{OUT}/world-{name}-under.webp", "WEBP", quality=84, method=6)
    # Previews: the render back in its own ramp, and in another.
    for r, tag in ((ramp, "own"), ((ramp + 2) % 5, "other")):
        back = LUT[r][field.astype(int)] + (under.astype(np.float32) - 128) * 2
        Image.fromarray(np.clip(back, 0, 255).astype(np.uint8)[:, PAD:-PAD]).resize((1024, 512)).save(f"{S}/preview-{name}-{tag}.png")
    print(f"  wrote world-{name}-field.webp and world-{name}-under.webp")

build("wind", "raw9.png", 402.7, 964.5, 817.0, 0, land_by_colour)
build("temperature", "raw12.png", 462.0, 955.7, 1100.6, 1, land_by_texture, polar=0.04)
