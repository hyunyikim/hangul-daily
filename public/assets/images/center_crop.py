"""
Smart center crop: detects the visual center of each subject
and crops a square around it.

Works best when images have a clear/solid background (e.g. white).

Usage:
    pip install Pillow
    python center_crop.py
"""

from pathlib import Path
from PIL import Image, ImageOps
import numpy as np

folder = Path(__file__).parent
png_files = sorted(f for f in folder.glob("*.png"))
print(f"Found {len(png_files)} PNG files to process.\n")

def find_subject_center(img: Image.Image):
    """
    Returns (cx, cy) — the center of the non-background subject.
    Converts to RGBA, then uses the alpha channel (if available)
    or luminance contrast against the corner-sampled background color.
    """
    rgba = img.convert("RGBA")
    arr = np.array(rgba)

    # Try alpha channel first (transparent background)
    alpha = arr[:, :, 3]
    if alpha.min() < 255:
        mask = alpha > 30          # non-transparent pixels
    else:
        # Sample background from the four corners
        corners = [
            arr[0, 0, :3],
            arr[0, -1, :3],
            arr[-1, 0, :3],
            arr[-1, -1, :3],
        ]
        bg = np.mean(corners, axis=0)

        # Mask pixels that differ significantly from background
        diff = np.abs(arr[:, :, :3].astype(int) - bg).sum(axis=2)
        mask = diff > 30           # threshold: tweak if needed

    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)

    if not rows.any() or not cols.any():
        # Fallback: use geometric center
        return img.width // 2, img.height // 2

    row_min, row_max = np.where(rows)[0][[0, -1]]
    col_min, col_max = np.where(cols)[0][[0, -1]]

    cx = int((col_min + col_max) / 2)
    cy = int((row_min + row_max) / 2)
    return cx, cy


for img_path in png_files:
    with Image.open(img_path) as img:
        w, h = img.size
        side = min(w, h)

        cx, cy = find_subject_center(img)

        # Build square crop box centered on subject
        left  = cx - side // 2
        top   = cy - side // 2
        right  = left + side
        bottom = top  + side

        # Clamp so the box stays within image bounds
        if left < 0:
            left, right = 0, side
        if top < 0:
            top, bottom = 0, side
        if right > w:
            left, right = w - side, w
        if bottom > h:
            top, bottom = h - side, h

        cropped = img.crop((left, top, right, bottom))
        cropped.save(img_path)

        geo_cx, geo_cy = w // 2, h // 2
        shift_x = cx - geo_cx
        shift_y = cy - geo_cy
        print(f"  {img_path.name}: {w}x{h} → {side}x{side}  |  subject center offset: ({shift_x:+d}, {shift_y:+d})")

print("\nDone! All images smart-cropped around their subject center.")
