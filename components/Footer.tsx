import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";
import { getPublishedServices, hasEnoughPosts } from "@/lib/queries";
import { site } from "@/lib/site";
import Logo from "@/components/Logo";
import FooterCta from "@/components/FooterCta";

// Icons for the platforms we can draw, keyed by lowercase label. A social link
// whose label is not listed here still renders, as a text link.
const socialIcons: Record<string, React.ReactNode> = {
  facebook: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.79-3.89 1.1 0 2.25.2 2.25.2v2.46h-1.27c-1.25 0-1.64.78-1.64 1.57V12h2.79l-.45 2.89h-2.34v6.99A10 10 0 0 0 22 12Z" />
    </svg>
  ),
  instagram: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="3.8" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.4" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  ),
  x: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-6.8 7.78L23 22h-6.1l-4.78-6.26L6.7 22H3.6l7.3-8.35L1.5 2h6.25l4.32 5.7L18.9 2Zm-1.07 18h1.7L6.83 3.9h-1.82L17.83 20Z" />
    </svg>
  ),
  linkedin: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6.94 8.5H3.56V20h3.38V8.5ZM5.25 3A1.97 1.97 0 1 0 5.3 6.94 1.97 1.97 0 0 0 5.25 3ZM20.45 13.37c0-3.4-1.8-4.98-4.2-4.98a3.63 3.63 0 0 0-3.27 1.8V8.5H9.62V20h3.36v-6.1c0-1.6.31-3.16 2.3-3.16 1.96 0 1.98 1.83 1.98 3.26V20h3.36v-6.63Z" />
    </svg>
  ),
  github: (
    <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  ),
};
socialIcons.twitter = socialIcons.x;

// Every link in this footer goes somewhere real. Columns for pages that do not
// exist yet (team, careers, docs, pricing, FAQ, legal) were removed rather than
// pointed at "#"; add them back here when the pages exist.
export default async function Footer() {
  noStore(); // admin edits to services must show immediately

  // The service list is generated from the published services, so it can never
  // drift from what the site actually offers. If the database is unreachable
  // the footer still renders, without the list.
  let serviceLinks: { title: string; slug: string }[] = [];
  try {
    serviceLinks = await getPublishedServices();
  } catch (err) {
    console.error("Footer services fetch error:", err);
  }
  const showNotes = await hasEnoughPosts();

  const companyLinks = [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    ...(showNotes ? [{ label: "Notes", href: "/notes" }] : []),
    { label: "Contact", href: "/contact" },
  ];

  // The legal pages are drafts until reviewed; see `legalReviewed` in lib/site.ts.
  const legalLinks = site.legalReviewed
    ? [
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ]
    : [];

  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--surface)] border-t border-[var(--border)]">
      {/* The contact CTA, on every page except /contact itself */}
      <FooterCta />

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] gap-12 pb-12 border-b border-[var(--border)]">
          {/* Brand */}
          <div>
            <Link href="/" aria-label={`${site.name}, home`} className="inline-block mb-4 -ml-1.5">
              <Logo height={36} />
            </Link>
            <p className="font-body text-[var(--muted)] text-sm leading-relaxed mb-6 max-w-sm">
              Software for universities, hospitals and the teams that run them.
            </p>
            {site.socials.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                {site.socials.map((item) => {
                  const icon = socialIcons[item.label.toLowerCase()];
                  return icon ? (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      className="w-9 h-9 rounded-md bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-center text-[var(--muted)] hover:bg-accent hover:border-accent hover:text-white transition-colors"
                    >
                      {icon}
                    </a>
                  ) : (
                    <a
                      key={item.href}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body text-sm text-[var(--muted)] hover:text-[var(--accent-text)] transition-colors hover-line"
                    >
                      {item.label}
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Company */}
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)] mb-5">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-body text-sm text-[var(--muted)] hover:text-[var(--accent-text)] transition-colors hover-line">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services, from the database */}
          {serviceLinks.length > 0 && (
            <div>
              <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-[var(--muted)] mb-5">Services</h4>
              <ul className="space-y-3">
                {serviceLinks.map((service) => (
                  <li key={service.slug}>
                    <Link href={`/services/${service.slug}`} className="font-body text-sm text-[var(--muted)] hover:text-[var(--accent-text)] transition-colors hover-line">
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-body text-[var(--muted)] text-sm text-center md:text-left">
            © {year} {site.name}. {site.location}.
          </p>
          {legalLinks.length > 0 && (
            <ul className="flex items-center gap-6">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="font-body text-sm text-[var(--muted)] hover:text-[var(--accent-text)] transition-colors hover-line">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </footer>
  );
}
