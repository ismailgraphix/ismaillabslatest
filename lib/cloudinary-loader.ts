// lib/cloudinary-loader.ts
// The image loader for next/image (set in next.config.mjs). Every content
// image lives on the site's own Cloudinary account, so Cloudinary does the
// resizing: each request asks for the width the layout needs, in the best
// format the browser accepts (f_auto: AVIF or WebP) at automatic quality.
// Anything that is not a Cloudinary upload URL is returned unchanged.
const MARKER = "/image/upload/";

export default function cloudinaryLoader({ src, width, quality }: { src: string; width: number; quality?: number }) {
    if (!src.startsWith("https://res.cloudinary.com/") || !src.includes(MARKER)) return src;
    const transform = `f_auto,q_${quality ?? "auto"},c_limit,w_${width}`;
    return src.replace(MARKER, `${MARKER}${transform}/`);
}
