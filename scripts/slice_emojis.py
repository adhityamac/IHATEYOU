import os
from PIL import Image

# Ensure output directory
output_dir = 'public/emojis'
if not os.path.exists(output_dir):
    os.makedirs(output_dir)

# Open image
try:
    img = Image.open('public/custom_emoji_grid.png')
    width, height = img.size
    
    # Calculate cell size
    # Assuming 6x6 grid as determined previously
    rows = 6
    cols = 6
    cell_w = width / cols
    cell_h = height / rows

    print(f"Image size: {width}x{height}. Cell size: {cell_w}x{cell_h}")

    # Slice
    count = 0
    for row in range(rows):
        for col in range(cols):
            left = col * cell_w
            top = row * cell_h
            right = left + cell_w
            bottom = top + cell_h
            
            # Crop
            cropped = img.crop((left, top, right, bottom))
            
            # Add a slight padding/margin crop if needed to remove borders? 
            # For now, distinct slice.
            
            # Save
            filename = f"emoji_r{row}_c{col}.png"
            cropped.save(os.path.join(output_dir, filename))
            # print(f"Saved {filename}")
            count += 1

    print(f"Done. Sliced {count} emojis to {output_dir}.")

except Exception as e:
    print(f"Error: {e}")
