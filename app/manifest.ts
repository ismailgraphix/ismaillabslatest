// app/manifest.ts
// Web app manifest, served at /manifest.webmanifest. Next.js adds the
// <link rel="manifest"> tag to every page.
import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: site.name,
        short_name: site.name,
        start_url: "/",
        display: "browser",
        background_color: "#EBEBEB",
        theme_color: "#0F0F0F",
        icons: [
            { src: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
            { src: "/brand/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
    };
}
