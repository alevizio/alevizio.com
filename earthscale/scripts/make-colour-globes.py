# The five small globes beside the palette's ramps: the 10 m wind render set
# in each of the product's ramps, the way the hero's globe sets it (the
# field through the ramp, the imagery put back), as small equirectangular
# maps, the overlap at either end taken off. Run from earthscale/:
#   uv run --with numpy --with pillow python3 scripts/make-colour-globes.py
import numpy as np
from PIL import Image

NAMES = ["viridis", "plasma", "inferno", "magma", "cividis"]
PAD = 26  # columns of overlap at either end of the globe's maps
SIZE = (384, 192)

field = np.asarray(Image.open("src/assets/globe/wind-field.webp").convert("RGB"), np.float32)[:, PAD:-PAD, 0] / 255
under = np.asarray(Image.open("src/assets/globe/wind-under.webp").convert("RGB"), np.float32)[:, PAD:-PAD] / 255 * 2 - 1
lut = np.asarray(Image.open("src/assets/globe/ramps.png").convert("RGB"), np.float32) / 255
step = np.clip((field * 255).round().astype(int), 0, 255)
for row, name in enumerate(NAMES):
    colour = np.clip(lut[row][step] + under, 0, 1)
    picture = Image.fromarray((colour * 255).round().astype(np.uint8)).resize(SIZE, Image.LANCZOS)
    picture.save(f"src/assets/colour/globe-{name}.webp", quality=86, method=6)
    print(name, picture.size)
