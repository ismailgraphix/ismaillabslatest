// components/Logo.tsx
// The one logo component for the whole site. It shows the official files from
// public/brand/ exactly as supplied: never recoloured, stretched or given
// effects. The files carry their own clear space (one bar width) inside the
// artwork, so nothing needs to be added around them.
import { site } from "@/lib/site";

type LogoProps = {
    /** "full" is the mark plus the wordmark. "mark" is the two bars and the dot alone, for small spaces. */
    kind?: "full" | "mark";
    /**
     * "auto" follows the site's light/dark theme. Use "on-dark" or "on-light"
     * where the background does not change with the theme (the admin is always dark).
     */
    variant?: "auto" | "on-dark" | "on-light";
    /** Rendered height in px. The header uses 28 to 32. */
    height?: number;
    /** Classes for the wrapper, for example responsive visibility. Defaults to inline-block. */
    className?: string;
};

const FILES = {
    full: { onLight: "/brand/logo.svg", onDark: "/brand/logo-on-dark.svg", ratio: 267.55 / 68 },
    mark: { onLight: "/brand/mark.svg", onDark: "/brand/mark-on-dark.svg", ratio: 1 },
};

export default function Logo({ kind = "full", variant = "auto", height = 32, className = "inline-block" }: LogoProps) {
    const file = FILES[kind];
    const width = Math.round(height * file.ratio);

    const image = (src: string, visibility: string) => (
        <img
            src={src}
            alt={site.name}
            width={width}
            height={height}
            className={visibility}
            style={{ height, width: "auto", maxWidth: "none" }}
        />
    );

    return (
        <span className={className}>
            {variant === "on-light" && image(file.onLight, "block")}
            {variant === "on-dark" && image(file.onDark, "block")}
            {variant === "auto" && (
                <>
                    {/* Both files are in the HTML and CSS shows the one for the current theme,
                        so there is no flash or swap after hydration. */}
                    {image(file.onLight, "block dark:hidden")}
                    {image(file.onDark, "hidden dark:block")}
                </>
            )}
        </span>
    );
}
