import { ReactNode } from "react";

interface EmptyStateProps {
    icon: ReactNode;
    message: string;
    action?: ReactNode;
}

export default function EmptyState({ icon, message, action }: EmptyStateProps) {
    return (
        <div className="relative flex flex-col items-center justify-center py-24 text-center overflow-hidden">
            <div
                className="absolute rounded-full border border-[var(--border)] pointer-events-none"
                style={{ width: 220, height: 220 }}
            />
            <div
                className="absolute rounded-full border border-[var(--border)] pointer-events-none opacity-60"
                style={{ width: 150, height: 150 }}
            />
            <div className="relative w-12 h-12 bg-[var(--surface)] border border-[var(--border)] rounded-full flex items-center justify-center mb-4 text-[var(--text-faint)]">
                {icon}
            </div>
            <p className="relative font-body text-[var(--text-soft)] text-sm max-w-xs">{message}</p>
            {action && <div className="relative mt-4">{action}</div>}
        </div>
    );
}
