// app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { PageViewTracker } from "@/components/PageViewTracker";
import ThemeProvider from "@/components/ThemeProvider";
import { site } from "@/lib/site";

// The three type families, loaded and self-hosted by next/font. Each one sets a
// CSS variable that tailwind.config.ts maps to font-heading, font-body and
// font-mono.
const headingFont = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-heading",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  // Pages set a short title of their own ("Work", "About", ...) and the
  // template adds the studio name.
  title: {
    default: `${site.name}: software for universities and hospitals`,
    template: `%s · ${site.name}`,
  },
  description:
    "We build the software universities and hospitals run on: student portals, hospital records, payments and the systems behind them. Built in Abuja for clients anywhere.",
  // Icons come from the logo kit in public/brand/. /favicon.ico is a copy at
  // the site root because browsers and crawlers request that path directly.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/brand/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/brand/apple-touch-icon.png", sizes: "180x180" }],
  },
  // Default share image for every page. A page can override it with its own.
  openGraph: {
    type: "website",
    siteName: site.name,
    images: [{ url: "/brand/social-share.png", width: 1200, height: 630, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/brand/social-share.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${headingFont.variable} ${bodyFont.variable} ${monoFont.variable}`}
    >
      <body>
        <ThemeProvider>
          <PageViewTracker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
