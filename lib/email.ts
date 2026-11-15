// lib/email.ts
// Sends the studio an email when someone submits the contact form.
//
// It uses Resend's HTTP API through fetch, so no package is needed. Nothing is
// sent until these are set in the environment (Vercel > Settings >
// Environment Variables):
//
//   RESEND_API_KEY       the API key from resend.com
//   CONTACT_EMAIL_FROM   a sender on a domain verified in Resend,
//                        for example "Ismail Labs <website@ismaillabs.com>"
//   CONTACT_EMAIL_TO     optional; where messages go (defaults to site.email)
//
// Until then the message is still saved and shows in /admin/messages; only
// the email is skipped. A failed send never loses the message either.
import { site } from "@/lib/site";

export interface ContactEmail {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export type SendResult = { sent: true } | { sent: false; reason: "not-configured" | "failed" };

export async function sendContactEmail(msg: ContactEmail): Promise<SendResult> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.CONTACT_EMAIL_FROM;
    const to = process.env.CONTACT_EMAIL_TO || site.email;
    if (!apiKey || !from) return { sent: false, reason: "not-configured" };

    const text = [
        `New message from the ${site.name} website.`,
        "",
        `Name: ${msg.name}`,
        `Email: ${msg.email}`,
        `Subject: ${msg.subject || "(none)"}`,
        "",
        msg.message,
        "",
        `Reply to this email to answer ${msg.name} directly. It is also in the admin under Messages.`,
    ].join("\n");

    try {
        const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
            body: JSON.stringify({
                from,
                to: [to],
                reply_to: msg.email,
                subject: `Website: ${msg.subject || `Message from ${msg.name}`}`.slice(0, 200),
                text,
            }),
            signal: AbortSignal.timeout(8000),
            cache: "no-store",
        });
        if (!res.ok) {
            console.error("[contact email] Resend returned", res.status, await res.text().catch(() => ""));
            return { sent: false, reason: "failed" };
        }
        return { sent: true };
    } catch (err) {
        console.error("[contact email] send failed", err);
        return { sent: false, reason: "failed" };
    }
}
