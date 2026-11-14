// components/BarLoader.tsx
// The loader: the logo's two bars filling alternately. Styles in app/globals.css.
export default function BarLoader({
    label = "Loading",
    size = 16,
    className = "",
}: {
    /** Read by screen readers. Pass an empty string when nearby text already says what is happening. */
    label?: string;
    /** Height in px. */
    size?: number;
    className?: string;
}) {
    const bar = Math.max(2, Math.round(size / 4));
    return (
        <span
            role={label ? "status" : undefined}
            aria-label={label || undefined}
            aria-hidden={label ? undefined : true}
            className={`bar-loader inline-flex items-end ${className}`}
            style={{ height: size, gap: bar }}
        >
            <span className="block h-full bg-current" style={{ width: bar }} />
            <span className="block h-full bg-current" style={{ width: bar }} />
        </span>
    );
}
