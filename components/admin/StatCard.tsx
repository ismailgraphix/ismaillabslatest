import Link from "next/link";
import { ReactNode } from "react";

interface StatCardProps {
    label: string;
    value: number | string;
    color?: string;
    href?: string;
    icon?: ReactNode;
    delay?: number;
}

export default function StatCard({ label, value, color = "#4353FF", href, icon, delay = 0 }: StatCardProps) {
    const body = (
        <>
            {icon && (
                <div className="flex items-start justify-between mb-4">
                    <span className="text-2xl">{icon}</span>
                    {href && (
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="text-[var(--text-faint)] group-hover:text-[var(--text-soft)] transition-colors">
                            <path d="M3 13L13 3M13 3H6M13 3v7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    )}
                </div>
            )}
            <p className="font-heading font-black text-3xl md:text-4xl text-[var(--text)] mb-1 tabular-nums">{value}</p>
            <p className="font-body text-[var(--text-faint)] text-[10px] uppercase tracking-widest">{label}</p>
            <div className="mt-4 h-0.5 w-0 group-hover:w-full transition-all duration-500" style={{ background: color }} />
        </>
    );

    const className = "fade-up group block bg-[var(--surface)] border border-[var(--border)] rounded-lg px-5 py-5 hover:border-white/20 transition-all duration-200";
    const style = { animationDelay: `${delay}ms` };

    if (href) {
        return (
            <Link href={href} className={className} style={style}>
                {body}
            </Link>
        );
    }

    return (
        <div className={className} style={style}>
            {body}
        </div>
    );
}
