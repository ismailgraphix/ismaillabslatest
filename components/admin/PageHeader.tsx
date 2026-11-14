import { ReactNode } from "react";
import Eyebrow from "./Eyebrow";

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    eyebrow?: string;
    actions?: ReactNode;
}

export default function PageHeader({ title, subtitle, eyebrow, actions }: PageHeaderProps) {
    return (
        <div className="sticky top-0 z-10 bg-[var(--app-bg)]/95 backdrop-blur border-b border-[var(--border)] px-8 py-4 flex items-center justify-between gap-4">
            <div className="min-w-0">
                {eyebrow && <Eyebrow className="mb-1.5">{eyebrow}</Eyebrow>}
                <h1 className="font-heading font-black text-[var(--text)] text-xl uppercase tracking-tight truncate">{title}</h1>
                {subtitle && <p className="font-body text-[var(--text-faint)] text-xs mt-0.5">{subtitle}</p>}
            </div>
            {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
        </div>
    );
}
