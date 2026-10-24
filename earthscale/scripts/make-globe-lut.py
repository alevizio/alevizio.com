# The product's five colour ramps as a lookup texture: 256 steps across,
# one row per ramp, Viridis, Plasma, Inferno, Magma, Cividis, padded to 8
# rows (a power of two). Written with matplotlib's own tables:
#   uv run --with matplotlib --with numpy --with pillow python3 scripts/make-globe-lut.py src/assets/globe/ramps.png
import sys
import numpy as np
from matplotlib import colormaps
from PIL import Image
out = sys.argv[1]
names = ["viridis", "plasma", "inferno", "magma", "cividis"]
lut = np.zeros((8, 256, 3), np.uint8)
for i, name in enumerate(names):
    lut[i] = (colormaps[name](np.linspace(0, 1, 256))[:, :3] * 255).round().astype(np.uint8)
lut[5:] = lut[4]
Image.fromarray(lut).save(out)
np.save(out.replace(".png", ".npy"), lut[:5].astype(np.float32))
print("lut written", lut.shape)
