# LVOF T-Shirt Tools

## 1. Shirt Art Prep (`index.html`), internal
Open artwork someone sent you (PDF, JPG, PNG, WebP, GIF, BMP, SVG), remove the background, convert it to vector, and download it.

1. **Remove background**: the background color is detected from the corners. **Background only** removes just the background around the design, so black inside the design stays. **Everywhere** removes that color throughout. **Cutoff** controls how close a color must be to count as background.
2. **Vectorize**: traces the art into smooth vector shapes. **Colors** sets how many colors to keep, **Speck cleanup** drops tiny dots, and **Detail** trades speed for accuracy. After tracing, tap any color swatch to hide or show that color.
3. **Download SVG** (the true vector) or **Download PNG** (rendered from the vector at 4500px on the long side, which is 15" at 300 dpi).

Open `index.html` in a browser. It loads pdf.js (cdnjs) and ImageTracer.js (jsDelivr) from public CDNs.

## 2. Memorial shirt builder — storefront (coming)
Customers upload a photo and enter a name, birth date and death date. Output is a fixed-size image cropped to the face, laid out on a template.
