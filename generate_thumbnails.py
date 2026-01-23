import fitz  # PyMuPDF
import os

# Base path - get the script's directory and append Projects
script_dir = os.path.dirname(os.path.abspath(__file__))
base_path = os.path.join(script_dir, "Projects")

# List of all PDFs with their paths (relative to Projects folder)
pdfs = [
    # Baumit
    "Baumit/Group FD/BFY-FD-A1B119-0.pdf",
    "Baumit/Group FD/BFY-FD-A1B34-0.pdf",
    "Baumit/Group FD/BFY-FD-A1V30-0.pdf",
    "Baumit/Group GA/BFY-GA-A1-01-0-Model.pdf",
    "Baumit/Group GA/BFY-GA-A1-03-0-Model.pdf",
    "Baumit/Group GA/BFY-GA-A1-17-0-Model.pdf",
    "Baumit/Group GA/BFY-GA-A2-01-0.pdf",
    "Baumit/Group GA/BFY-GA-A2-02-0.pdf",
    "Baumit/Group GA/BFY-GA-A2-06-0.pdf",
    "Baumit/Group GA/BFY-GA-A3-01-0.pdf",
    "Baumit/Group GA/BFY-GA-A3-04-0.pdf",
    "Baumit/Group GA/BFY-GA-A3-12-0.pdf",

    # CimCoop
    "CimCoop/Group FD/OFC-WD-FD-BA10-B.pdf",
    "CimCoop/Group FD/OFC-WD-FD-HA24-B.pdf",
    "CimCoop/Group FD/OFC-WD-FD-KA13-B.pdf",
    "CimCoop/Group FD/OFC-WD-FD-TA1-B.pdf",
    "CimCoop/Group FD/OFC-WD-FD-TA2-B.pdf",
    "CimCoop/Group GA/OFC-WD-GA-01-B.pdf",
    "CimCoop/Group GA/OFC-WD-GA-02-B.pdf",
    "CimCoop/Group GA/OFC-WD-GA-03-B.pdf",
    "CimCoop/Group GA/OFC-WD-GA-04-B.pdf",
    "CimCoop/Group GA/OFC-WD-GA-05-B.pdf",
    "CimCoop/Group GA/OFC-WD-GA-06-B.pdf",
    "CimCoop/Group GA/OFC-WD-GA-07-B.pdf",
    "CimCoop/Group GA/OFC-WD-GA-08-B.pdf",

    # MFG General
    "MFG - General/MFG - Generic 4 Bay GA - Detailed Layout GA.pdf",

    # MFG Projects
    "MFG - Projects/MFG - Glyne Gap/Glyne Gap Service Station - Foundation GA.pdf",
    "MFG - Projects/MFG - Glyne Gap/Glyne Gap Service Station - Layout GA.pdf",
    "MFG - Projects/MFG - Stretford/MFG - Stretford - Foundation - GA-01 - Rev 2.pdf",
    "MFG - Projects/MFG - Stretford/MFG - Stretford - Layout GA-01 - Rev 2.pdf",
    "MFG - Projects/MFG - Wellington/MFG Wellington - Layout GA.pdf",
    "MFG - Projects/MFG - Crow Orchard/MFG Crow Orchard - GA.pdf",

    # Schools
    "Oxford LT/Bishop David Brown/704149-3-Bishop David Brown-Layout GA-Sections .pdf",
    "Oxford LT/Castle View/725014-01-R01-Castle View Academy-Foundation Layout GA.pdf",
    "Oxford LT/Castle View/725014-01-R01-Castle View Academy-Layout GA.pdf",
    "Oxford XL/Lavington/724041-03-R1-Lavington School-Layout - GA2.pdf",
    "Uxbridge/704509--Claremont Primary School - Dining Hall-3D - View - GA.pdf",

    # Portfolio and CV
    "Portfolio/Old-Company-Portfolio.pdf",
    "Modern Professional CV Resume.pdf",
]

def get_thumbnail_path(pdf_path):
    """Generate thumbnail path based on PDF path"""
    # Get directory and filename
    dir_path = os.path.dirname(pdf_path)
    filename = os.path.basename(pdf_path)
    thumb_name = os.path.splitext(filename)[0] + ".jpg"

    # Special case for CV in root Projects folder
    if dir_path == "":
        return os.path.join("thumbnails", thumb_name)

    # Get the project folder (first level)
    parts = dir_path.split("/")

    # For nested folders like "MFG - Projects/MFG - Glyne Gap"
    if len(parts) >= 2 and parts[0] == "MFG - Projects":
        thumb_dir = os.path.join(parts[0], parts[1], "thumbnails")
    elif len(parts) >= 2 and (parts[0] == "Oxford LT" or parts[0] == "Oxford XL"):
        thumb_dir = os.path.join(parts[0], parts[1], "thumbnails")
    else:
        # First level folder like "Baumit", "CimCoop", etc.
        thumb_dir = os.path.join(parts[0], "thumbnails")

    return os.path.join(thumb_dir, thumb_name)

def generate_thumbnail(pdf_path, output_path, dpi=150):
    """Generate a thumbnail from the first page of a PDF"""
    try:
        full_pdf_path = os.path.join(base_path, pdf_path)
        full_output_path = os.path.join(base_path, output_path)

        # Ensure output directory exists
        os.makedirs(os.path.dirname(full_output_path), exist_ok=True)

        # Open PDF
        doc = fitz.open(full_pdf_path)

        # Get first page
        page = doc[0]

        # Render page to image
        zoom = dpi / 72  # 72 is the default DPI
        mat = fitz.Matrix(zoom, zoom)
        pix = page.get_pixmap(matrix=mat)

        # Save as JPEG
        pix.save(full_output_path)

        doc.close()

        print(f"Created: {output_path}")
        return True

    except Exception as e:
        print(f"Error processing {pdf_path}: {e}")
        return False

def main():
    print("Generating PDF thumbnails...")
    print("=" * 50)

    success_count = 0
    fail_count = 0

    for pdf in pdfs:
        thumb_path = get_thumbnail_path(pdf)
        if generate_thumbnail(pdf, thumb_path):
            success_count += 1
        else:
            fail_count += 1

    print("=" * 50)
    print(f"Complete! Success: {success_count}, Failed: {fail_count}")

    # Print mapping for script.js
    print("\n\nThumbnail mapping for script.js:")
    print("=" * 50)
    for pdf in pdfs:
        thumb = get_thumbnail_path(pdf)
        print(f"'{pdf}' => '{thumb}'")

if __name__ == "__main__":
    main()
