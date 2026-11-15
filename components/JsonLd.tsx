// components/JsonLd.tsx
// Structured data for search engines (schema.org JSON-LD), from lib/seo.ts.
// "<" is escaped so text from the CMS cannot close the script element.
export default function JsonLd({ data }: { data: object | object[] }) {
    const json = JSON.stringify(data).replace(/</g, "\\u003c");
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
