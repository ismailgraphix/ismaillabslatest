// lib/image-size.ts
// The pixel size of a Cloudinary image, so a screenshot shown at its natural
// height can reserve its space before it loads (no layout shift). Cloudinary's
// fl_getinfo returns the original's width and height as JSON. Results are
// cached for a day. Returns null for other URLs or on any failure; callers
// then fall back to a fixed aspect ratio.
const MARKER = "/image/upload/";

export async function getImageSize(src: string | null | undefined): Promise<{ width: number; height: number } | null> {
    if (!src || !src.startsWith("https://res.cloudinary.com/") || !src.includes(MARKER)) return null;
    try {
        const res = await fetch(src.replace(MARKER, `${MARKER}fl_getinfo/`), {
            next: { revalidate: 86400 },
            signal: AbortSignal.timeout(3000),
        });
        if (!res.ok) return null;
        const info = (await res.json()) as { input?: { width?: number; height?: number } };
        const { width, height } = info.input ?? {};
        return width && height ? { width, height } : null;
    } catch {
        return null;
    }
}
