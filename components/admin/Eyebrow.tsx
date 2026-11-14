import { ReactNode } from "react";

interface EyebrowProps {
    children: ReactNode;
    dot?: boolean;
    color?: string;
    className?: string;
}

export default function Eyebrow({ children, dot = true, color = "#4353FF", className = "" }: EyebrowProps) {
    return (
        <span className={`inline-flex items-center gap-2 font-body text-[10.5px] font-semibold text-[var(--text-soft)] uppercase tracking-[0.2em] ${className}`}>
            {dot && (
                <span className="relative flex h-1.5 w-1.5 shrink-0">
                    <span
                        className="absolute inline-flex h-full w-full rounded-full opacity-60"
                        style={{ background: color, animation: "pulseDot 2.4s ease-in-out infinite" }}
                    />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5" style={{ background: color }} />
                </span>
            )}
            {children}
        </span>
    );
}
