from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import random

# Canvas settings
WIDTH, HEIGHT = 768, 768
BACKGROUND_COLOR = (249, 245, 240)  # Light beige background
BURST_COLOR = (177, 156, 255, 80)   # Pastel purple with alpha

# Create base image
image = Image.new("RGBA", (WIDTH, HEIGHT), BACKGROUND_COLOR + (255,))
draw = ImageDraw.Draw(image, 'RGBA')

# Random circular blobs in a roughly centered burst
num_blobs = 100
for _ in range(num_blobs):
    # Random radius and position around the center
    radius = random.randint(40, 100)
    dx = int(np.random.normal(0, WIDTH * 0.15))  # Gaussian distribution around center
    dy = int(np.random.normal(0, HEIGHT * 0.15))
    x = WIDTH // 2 + dx
    y = HEIGHT // 2 + dy

    # Draw an ellipse with soft purple color
    draw.ellipse((x - radius, y - radius, x + radius, y + radius), fill=BURST_COLOR)

# Apply a blur to soften the shapes and blend them
blurred = image.filter(ImageFilter.GaussianBlur(radius=18))

# Composite over background to flatten alpha and convert to RGB
final = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND_COLOR)
final.paste(blurred, mask=blurred.split()[3])  # Use alpha channel as mask

# Save image
final.save("public/lovable-uploads/purple_burst.png") 