// components/PageHeader.tsx
// The opening block of an inner page: section label, h1 and an optional intro.
import SectionLabel from "@/components/SectionLabel";

export default function PageHeader({
    label,
    title,
    children,
}: {
    label: string;
    title: React.ReactNode;
    children?: React.ReactNode;
}) {
    return (
        <header className="max-w-[1300px] mx-auto px-6 md:px-10 pt-36 pb-14">
            <SectionLabel className="mb-6">{label}</SectionLabel>
            <h1 className="font-heading font-bold text-[var(--text)] text-[clamp(2.5rem,6vw,5rem)] leading-[1.02] tracking-[-0.03em] max-w-4xl">
                {title}
            </h1>
            {children && (
                <div className="mt-6 max-w-2xl font-body text-[var(--muted)] text-lg leading-relaxed">{children}</div>
            )}
        </header>
    );
}
