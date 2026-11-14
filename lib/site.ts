// lib/site.ts
// Site-wide facts that are not CMS records. The public site reads them from
// here and nowhere else, so a number or a link cannot disagree between pages.
//
// Nothing in this file is invented. A value that has not been supplied stays
// empty (null or []), and the part of the site that would show it stays hidden.
// See "Content Ismail must supply" in docs/REBUILD_PLAN.md.

export interface SiteStat {
    /** Written exactly as it should read, for example "15+". Shown as static text. */
    value: string;
    label: string;
}

export interface SocialLink {
    /** Platform name, for example "LinkedIn", "GitHub", "X", "Instagram" or "Facebook". */
    label: string;
    /** Full profile URL. */
    href: string;
}

export interface Testimonial {
    quote: string;
    name: string;
    role: string;
    organisation: string;
}

export const site = {
    name: "Ismail Labs",
    email: "hello@ismaillabs.com",

    // [REAL PHONE]: a phone or WhatsApp number in international format.
    // The phone row on the contact section is hidden while this is null.
    phone: null as string | null,

    // [SOCIAL URLS]: real profile links only. Social links are hidden while empty.
    socials: [] as SocialLink[],

    // Confirmed numbers only (years in business, projects delivered, ...).
    // This is the single source for every stat on the site. Hidden while empty.
    stats: [] as SiteStat[],

    // Real client quotes, used with permission. The section needs at least two.
    testimonials: [] as Testimonial[],
};
