// app/(main)/not-found.tsx
// Shown when a public page calls notFound() (an unknown work, service or note
// slug, or a legal page that is not yet live). The (main) layout supplies the
// header and footer.
import NotFoundView from "@/components/NotFoundView";

export default function NotFound() {
    return <NotFoundView />;
}
