# Builds the first pass's live hero from the Figma's own pictures: the three
# maps stacked in its hero (Landing [Desktop] 10:1489, the group 10:1491),
# each cut the way the file frames it in a 1280 x 679 sheet, a fourth sheet
# that is the front map as data, and the page under the hero, which stays a
# picture.
#   fields: the river and its fields (f5c20.png, 4096 x 2304), the file's
#     crop: 121.5% wide, 128.84% high, from -12.13% left and -27.05% top.
#   pivots: the irrigation circles (1ad07.png, 1920 x 1840), covering.
#   delta: the delta in false colour (bdbf6.png, 1200 x 675), covering.
#   fields-band: the river and fields as one band, their greenness
#     (2G - R - B) / (2G + R + B), set in the file's Data Set 4 chip, its
#     cream to navy, the green fields dark and bare ground light.
#   rest: the page from 1280 px down (export.png, the frame at 2x), where
#     the hero's fade has reached the page colour.
#   python3 scripts/make-first-pass.py <dir with export.png> <dir with the three maps> <out dir>
# Needs numpy and Pillow.
import sys
import numpy as np
from PIL import Image

PAGE, MAPS, OUT = sys.argv[1], sys.argv[2], sys.argv[3]
Image.MAX_IMAGE_PIXELS = None
W, H = 1280, 679  # a sheet, in page px


def save(im, name, quality=82):
    im.save(f"{OUT}/{name}.webp", quality=quality, method=6)
    print(name, im.size)


def cover(im):
    """The middle of the picture at the sheet's shape, as object-fit does."""
    w, h = im.size
    s = max(W / w, H / h)
    cw, ch = W / s, H / s
    return im.crop((round((w - cw) / 2), round((h - ch) / 2), round((w + cw) / 2), round((h + ch) / 2)))


src = Image.open(f"{MAPS}/f5c20.png").convert("RGB")
sw, sh = src.size
iw, ih, ox, oy = W * 1.215, H * 1.2884, W * 0.1213, H * 0.2705
box = (ox / iw * sw, oy / ih * sh, (ox + W) / iw * sw, (oy + H) / ih * sh)
fields = src.crop(tuple(round(v) for v in box)).resize((W * 2, H * 2), Image.LANCZOS)
save(fields, "fields")
save(cover(Image.open(f"{MAPS}/1ad07.png").convert("RGB")), "pivots")
save(cover(Image.open(f"{MAPS}/bdbf6.png").convert("RGB")), "delta", 86)

rgb = np.asarray(fields).astype(float) / 255
r, g, b = rgb[..., 0], rgb[..., 1], rgb[..., 2]
green = (2 * g - r - b) / (2 * g + r + b + 1e-6)
lo, hi = np.percentile(green, 2), np.percentile(green, 98)
t = (1 - np.clip((green - lo) / (hi - lo), 0, 1)) ** 1.6
# Data Set 4's chip in the layers panel, from its navy end to its cream one.
stops = [(0, (5, 29, 62)), (0.175, (46, 56, 93)), (0.329, (131, 141, 147)), (0.56, (187, 201, 173)), (0.723, (202, 215, 183)), (1, (246, 248, 213))]
at = [s for s, _ in stops]
band = np.stack([np.interp(t, at, [c[k] for _, c in stops]) for k in range(3)], -1)
save(Image.fromarray(band.round().astype(np.uint8)), "fields-band")

page = Image.open(f"{PAGE}/export.png").convert("RGB")
pw, ph = page.size  # 2880 x 9448, the 1440 px frame at 2x
rest = page.crop((0, 1280 * 2, pw, ph))
save(rest.resize((2000, round(rest.height * 2000 / pw)), Image.LANCZOS), "rest", 80)
