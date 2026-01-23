from PIL import Image
import os

# Base path - get the script's directory and append Projects
script_dir = os.path.dirname(os.path.abspath(__file__))
base_path = os.path.join(script_dir, "Projects")

# Find all thumbnail folders and compress images
def compress_thumbnails():
    total_before = 0
    total_after = 0
    count = 0

    for root, dirs, files in os.walk(base_path):
        if 'thumbnails' in root:
            for file in files:
                if file.lower().endswith(('.jpg', '.jpeg', '.png')):
                    filepath = os.path.join(root, file)

                    # Get original size
                    original_size = os.path.getsize(filepath)
                    total_before += original_size

                    try:
                        img = Image.open(filepath)

                        # Convert to RGB if needed (for PNG with transparency)
                        if img.mode in ('RGBA', 'P'):
                            img = img.convert('RGB')

                        # Resize to max 400px width while maintaining aspect ratio
                        max_width = 400
                        if img.width > max_width:
                            ratio = max_width / img.width
                            new_height = int(img.height * ratio)
                            img = img.resize((max_width, new_height), Image.LANCZOS)

                        # Save with compression (quality 60-70 is good for web)
                        img.save(filepath, 'JPEG', quality=65, optimize=True)

                        # Get new size
                        new_size = os.path.getsize(filepath)
                        total_after += new_size

                        reduction = ((original_size - new_size) / original_size) * 100
                        print(f"Compressed: {file} - {original_size//1024}KB -> {new_size//1024}KB ({reduction:.1f}% reduction)")
                        count += 1

                    except Exception as e:
                        print(f"Error processing {file}: {e}")
                        total_after += original_size

    print("\n" + "="*50)
    print(f"Total files compressed: {count}")
    print(f"Total size before: {total_before // 1024} KB ({total_before // (1024*1024)} MB)")
    print(f"Total size after: {total_after // 1024} KB ({total_after // (1024*1024)} MB)")
    print(f"Total reduction: {((total_before - total_after) / total_before) * 100:.1f}%")

if __name__ == "__main__":
    compress_thumbnails()
