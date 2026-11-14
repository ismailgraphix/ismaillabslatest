// components/SectionLabel.tsx
// The small label above a section heading: a short accent bar (the bar from
// the logo) and a monospace caption. The caption uses the muted text colour
// rather than the accent, so it passes contrast in both themes.
export default function SectionLabel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            <span className="block h-[3px] w-6 shrink-0 bg-accent" aria-hidden="true" />
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{children}</span>
        </div>
    );
}
