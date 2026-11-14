// components/HeaderLogo.tsx
// The header's logo, drawn inline (rather than as an <img>) so its parts can
// move: on the first page load of a session the bars grow up from the
// baseline and the dot drops in; on hover or focus the dot blinks once. The
// CSS lives in app/globals.css under "Header logo".
//
// The geometry and wordmark are the official artwork from public/brand/
// (logo.svg and mark.svg). Ink parts use the theme's text colour, which is
// #0F0F0F in the light theme and #FFFFFF in the dark one, exactly as in
// logo.svg and logo-on-dark.svg; the dot is the brand accent in both.
import { site } from "@/lib/site";
import { WORDMARK_PATHS, WORDMARK_TRANSFORM } from "@/components/logo-paths";

const GEOMETRY = {
    // From logo.svg (viewBox 0 0 267.55 68)
    full: { viewBox: "0 0 267.55 68", ratio: 267.55 / 68, dot: [12, 12], short: [12, 28, 28], tall: [31, 12, 44] },
    // From mark.svg (viewBox 0 0 64 64)
    mark: { viewBox: "0 0 64 64", ratio: 1, dot: [17, 10], short: [17, 26, 28], tall: [36, 10, 44] },
} as const;

export default function HeaderLogo({ kind, height, className = "" }: { kind: "full" | "mark"; height: number; className?: string }) {
    const g = GEOMETRY[kind];
    return (
        <svg
            viewBox={g.viewBox}
            height={height}
            width={Math.round(height * g.ratio)}
            role="img"
            aria-label={site.name}
            className={`text-[var(--text)] ${className}`}
        >
            <rect className="logo-bar logo-bar-short" x={g.short[0]} y={g.short[1]} width="11" height={g.short[2]} fill="currentColor" />
            <rect className="logo-bar logo-bar-tall" x={g.tall[0]} y={g.tall[1]} width="11" height={g.tall[2]} fill="currentColor" />
            <rect className="logo-dot" x={g.dot[0]} y={g.dot[1]} width="11" height="11" fill="#4353FF" />
            {kind === "full" && (
                <g className="logo-wordmark" transform={WORDMARK_TRANSFORM} fill="currentColor">
                    {WORDMARK_PATHS.map((d, i) => (
                        <path key={i} d={d} />
                    ))}
                </g>
            )}
        </svg>
    );
}
