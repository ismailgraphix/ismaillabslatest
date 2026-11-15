// lib/seo.ts
// Page metadata and structured data, built one way for every public page.
//
// Next.js replaces (does not merge) a parent's openGraph and twitter objects
// when a page sets its own, so every page goes through pageMeta(): it always
// sets the canonical URL, the share title and description, and an image,
// falling back to the default share image.
import type { Metadata } from "next";
import { site } from "@/lib/site";

export const DEFAULT_SHARE_IMAGE = { url: "/brand/social-share.png", width: 1200, height: 630, alt: site.name };

interface PageMetaInput {
    /** Short page title; the root layout's template adds " · Ismail Labs". Omit for the home page. */
    title?: string;
    description: string;
    /** Path of the page, starting with "/". Becomes the canonical URL. */
    path: string;
    /** An image of the page's own (a case study screenshot, a note's cover). */
    image?: { url: string; alt: string } | null;
    /** "article" for notes; everything else is a website page. */
    type?: "website" | "article";
    publishedTime?: string;
    modifiedTime?: string;
}

export function pageMeta({ title, description, path, image, type = "website", publishedTime, modifiedTime }: PageMetaInput): Metadata {
    const shareTitle = title ? `${title} · ${site.name}` : `${site.name}: software for universities and hospitals`;
    const images = image ? [{ url: image.url, alt: image.alt }] : [DEFAULT_SHARE_IMAGE];
    return {
        ...(title ? { title } : {}),
        description,
        alternates: { canonical: path },
        openGraph: {
            type,
            siteName: site.name,
            locale: "en_GB",
            url: path,
            title: shareTitle,
            description,
            images,
            ...(type === "article" ? { publishedTime, modifiedTime } : {}),
        },
        twitter: {
            card: "summary_large_image",
            title: shareTitle,
            description,
            images: images.map((i) => i.url),
        },
    };
}

/** An absolute URL on the site, for structured data. */
export function absoluteUrl(path: string) {
    return new URL(path, site.url).toString();
}

export function organizationJsonLd() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: site.name,
        url: site.url,
        logo: absoluteUrl("/brand/icon-512.png"),
        email: site.email,
        description: "Software for universities, hospitals and the teams that run them.",
        ...(site.phone ? { telephone: site.phone } : {}),
        ...(site.socials.length > 0 ? { sameAs: site.socials.map((s) => s.href) } : {}),
    };
}

/** Breadcrumbs for a nested page: Home, then each crumb in order. */
export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
    const all = [{ name: "Home", path: "/" }, ...crumbs];
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: all.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.name,
            item: absoluteUrl(c.path),
        })),
    };
}

export function articleJsonLd(a: {
    title: string;
    description: string;
    path: string;
    image?: string | null;
    author?: string | null;
    published: Date;
    modified: Date;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: a.title,
        description: a.description,
        mainEntityOfPage: absoluteUrl(a.path),
        url: absoluteUrl(a.path),
        image: [a.image ? absoluteUrl(a.image) : absoluteUrl(DEFAULT_SHARE_IMAGE.url)],
        datePublished: a.published.toISOString(),
        dateModified: a.modified.toISOString(),
        author: a.author ? { "@type": "Person", name: a.author } : { "@type": "Organization", name: site.name },
        publisher: { "@type": "Organization", name: site.name, logo: { "@type": "ImageObject", url: absoluteUrl("/brand/icon-512.png") } },
    };
}
