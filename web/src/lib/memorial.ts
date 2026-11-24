export type Memorial = {
  firstName: string;
  lastName: string;
  dob: string; // yyyy-mm-dd
  dod: string;
  photo?: string; // data URL (until uploads go to storage)
  zoom: number;
  x: number; // object-position %
  y: number;
};

export const emptyMemorial: Memorial = { firstName: "", lastName: "", dob: "", dod: "", zoom: 1, x: 50, y: 35 };

export function foreverAge(dob: string, dod: string): number | null {
  if (!dob || !dod) return null;
  const b = new Date(dob + "T00:00:00"), d = new Date(dod + "T00:00:00");
  if (isNaN(+b) || isNaN(+d) || d < b) return null;
  let age = d.getFullYear() - b.getFullYear();
  if (d.getMonth() < b.getMonth() || (d.getMonth() === b.getMonth() && d.getDate() < b.getDate())) age--;
  return age;
}

/** 1993-10-27 -> 10/27/93, matching the existing yard signs */
export function shortDate(iso: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${+m}/${+d}/${y.slice(2)}`;
}

/** Downscale an uploaded photo to a JPEG data URL so it can live in the cart. */
export async function photoToDataUrl(file: File, max = 1400): Promise<string> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = rej;
      i.src = url;
    });
    const k = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement("canvas");
    c.width = Math.round(img.naturalWidth * k);
    c.height = Math.round(img.naturalHeight * k);
    const ctx = c.getContext("2d")!;
    ctx.imageSmoothingQuality = "high";
    ctx.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/jpeg", 0.88);
  } finally {
    URL.revokeObjectURL(url);
  }
}
