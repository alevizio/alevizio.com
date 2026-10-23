"""Makes public/hero/canopy.bin, the hero's point cloud: a 300 x 170 grid of
heights (one byte each) read from canopy-para.jpg, a lidar canopy render of
Para coloured by height in viridis. Viridis gets lighter as it climbs, so
lightness reads back as height. Run from pachama/: python3 scripts/hero/canopy-heights.py"""
import subprocess

W, H = 300, 170
# Crop the axis gizmo (top right) and the thin far band, then sample.
raw = subprocess.run(
    ["ffmpeg", "-v", "error", "-i", "scripts/hero/canopy-para.jpg",
     "-vf", f"crop=1800:1000:0:136,scale={W}:{H}:flags=area,format=rgb24", "-f", "rawvideo", "-"],
    capture_output=True, check=True).stdout
lum = [0.2126 * raw[i] + 0.7152 * raw[i + 1] + 0.0722 * raw[i + 2] for i in range(0, len(raw), 3)]
order = sorted(lum)
lo, hi = order[int(len(lum) * 0.01)], order[int(len(lum) * 0.995)]
heights = bytes(max(0, min(255, round(255 * (v - lo) / (hi - lo)))) for v in lum)
open("public/hero/canopy.bin", "wb").write(heights)
print(f"{W * H} points")
