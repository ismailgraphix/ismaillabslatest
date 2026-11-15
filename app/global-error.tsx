"use client";
// app/global-error.tsx
// Last resort, used only when the root layout itself fails. It replaces the
// whole document, so it brings its own <html> and plain inline styles (the
// site's CSS and fonts may be what failed).
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
    return (
        <html lang="en">
            <body style={{ margin: 0, background: "#EBEBEB", color: "#0F0F0F", fontFamily: "system-ui, sans-serif" }}>
                <main style={{ maxWidth: 640, margin: "0 auto", padding: "120px 24px" }}>
                    <p style={{ fontFamily: "ui-monospace, monospace", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", opacity: 0.7 }}>
                        Ismail Labs
                    </p>
                    <h1 style={{ fontSize: 40, lineHeight: 1.1, margin: "16px 0" }}>This page did not load.</h1>
                    <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.75 }}>
                        It is a problem on our side. Try again in a moment, or write to{" "}
                        <a href="mailto:hello@ismaillabs.com" style={{ color: "#3B4BF5" }}>hello@ismaillabs.com</a>.
                    </p>
                    <button
                        type="button"
                        onClick={reset}
                        style={{ marginTop: 24, background: "#4353FF", color: "#fff", border: 0, borderRadius: 6, padding: "14px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}
                    >
                        Try again
                    </button>
                </main>
            </body>
        </html>
    );
}
