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
    // Canonical production origin (ismaillabs.com redirects here). Used to build
    // absolute URLs for share images and, later, canonical links and the sitemap.
    url: "https://www.ismaillabs.com",
    email: "hello@ismaillabs.com",

    // [REAL PHONE]: a phone or WhatsApp number in international format.
    // The phone row on the contact page is hidden while this is null.
    phone: null as string | null,

    // [REPLY TIME]: how soon a message gets an answer, for example
    // "within two working days". Hidden on the contact page while null.
    replyTime: null as string | null,

    // [SOCIAL URLS]: real profile links only. Social links are hidden while empty.
    socials: [] as SocialLink[],

    // Availability month for the hero line, for example "March 2027", which
    // reads "Taking projects for March 2027". Hidden while null.
    availability: null as string | null,

    // [CLIENT LIST]: institutions that have agreed to be named. The strip on
    // the home page needs at least three and is hidden below that.
    clients: [] as string[],

    // Confirmed numbers only (years in business, projects delivered, ...).
    // This is the single source for every stat on the site. Hidden while empty.
    stats: [] as SiteStat[],

    // Real client quotes, used with permission. The section needs at least two.
    testimonials: [] as Testimonial[],

    founder: {
        name: "Ismail Muhammad Adam",
        // The founder paragraph on the About page. The plan's draft reads:
        //   "I'm Ismail Muhammad Adam, a software engineer. Since
        //    2022 I have built and maintained [SYSTEM TYPES] for [CLIENT TYPES].
        //    Ismail Labs is how I take that work on for clients."
        // Put the finished paragraph here once the two bracketed parts are
        // known. While this is null the page shows the bio from the admin
        // (Portfolio > description).
        bio: null as string | null,
    },

    // The stack on the About page, grouped the way the plan asks (for example
    // { label: "Frontend", items: ["React", "Next.js"] }, then "Backend",
    // "Databases", "Payments"). While this is empty the page lists the skills
    // entered in the admin (Portfolio) as one plain list instead.
    stackGroups: [] as { label: string; items: string[] }[],

    // The privacy and terms pages are drafts. They stay off the live site, and
    // out of the footer, until this is set to true after they have been reviewed.
    legalReviewed: false,
};
