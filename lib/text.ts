// lib/text.ts
// Small text helpers for turning CMS fields into short display copy.

/** Strip the Markdown a CMS description may contain, leaving plain text. */
export function plainText(markdown: string | null | undefined): string {
    return (markdown ?? "")
        .replace(/!\[[^\]]*\]\([^)]*\)/g, "") // images
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links keep their text
        .replace(/^#{1,6}\s+/gm, "") // headings
        .replace(/^\s*[-*+]\s+/gm, "") // list bullets
        .replace(/[*_`~>]/g, "") // emphasis, code, quotes
        .replace(/\s+/g, " ")
        .trim();
}

/**
 * The first sentence of a description, for cards that carry one line.
 * Falls back to a word-boundary cut when the first sentence runs long.
 */
export function firstSentence(text: string | null | undefined, maxLength = 160): string {
    const plain = plainText(text);
    const match = plain.match(/^.+?[.!?](?=\s|$)/);
    const sentence = match ? match[0] : plain;
    if (sentence.length <= maxLength) return sentence;
    const cut = sentence.slice(0, maxLength);
    return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:]$/, "") + "…";
}

/** "SOFTWARE ENGINEER" -> "Software engineer". Text that is not all capitals is returned unchanged. */
export function unshout(text: string): string {
    if (text !== text.toUpperCase() || text === text.toLowerCase()) return text;
    const lower = text.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
}
