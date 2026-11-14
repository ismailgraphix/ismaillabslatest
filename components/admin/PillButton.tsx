"use client";
import Link from "next/link";
import { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md";

interface PillButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
    variant?: Variant;
    size?: Size;
    href?: string;
    icon?: ReactNode;
    loading?: boolean;
    children: ReactNode;
}

const VARIANTS: Record<Variant, string> = {
    primary: "bg-[#4353FF] border-[#4353FF] text-white hover:bg-[var(--text)] hover:border-[var(--text)] hover:text-[var(--app-bg)]",
    outline: "bg-transparent border-[var(--border)] text-[var(--text)] hover:border-[#4353FF] hover:text-[#4353FF]",
    ghost: "bg-transparent border-transparent text-[var(--text-soft)] hover:text-[var(--text)] hover:bg-[var(--surface-2)]",
    danger: "bg-transparent border-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300",
};

const SIZES: Record<Size, string> = {
    sm: "px-3.5 py-2 text-[11px]",
    md: "px-5 py-2.5 text-[12.5px]",
};

const ArrowIcon = () => (
    <svg width="11" height="11" viewBox="0 0 12 12" fill="none"
        className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
        <path d="M1 11L11 1M11 1H4M11 1v7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const Spinner = () => (
    <svg className="animate-spin" width="12" height="12" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="2" strokeDasharray="20" strokeDashoffset="5" />
    </svg>
);

export default function PillButton({
    variant = "primary",
    size = "md",
    href,
    icon,
    loading,
    disabled,
    className = "",
    children,
    ...rest
}: PillButtonProps) {
    const classes = `group inline-flex items-center justify-center gap-2 rounded-full border font-body font-semibold transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:-translate-y-px ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

    const content = (
        <>
            {loading ? <Spinner /> : icon}
            {children}
            {!loading && variant === "primary" && <ArrowIcon />}
        </>
    );

    if (href) {
        const external = /^(mailto:|tel:|https?:\/\/|#)/.test(href);
        const linkProps = { className: classes, onClick: rest.onClick as any };
        if (external) {
            return (
                <a href={href} {...linkProps}>
                    {content}
                </a>
            );
        }
        return (
            <Link href={href} {...linkProps}>
                {content}
            </Link>
        );
    }

    return (
        <button className={classes} disabled={disabled || loading} {...rest}>
            {content}
        </button>
    );
}
