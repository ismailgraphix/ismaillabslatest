import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { hasEnoughPosts } from "@/lib/queries";
import { ViewTransitionProvider } from "@/lib/view-transition";
import RevealObserver from "@/components/RevealObserver";

// Every public page, including /about, uses this one header and footer.
async function Header() {
  return <Navbar showNotes={await hasEnoughPosts()} />;
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ViewTransitionProvider>
        {/* First stop for keyboard users: jumps past the header to the page content. */}
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent focus:px-4 focus:py-3 focus:font-body focus:text-sm focus:font-semibold focus:text-white focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-[var(--text)]"
        >
          Skip to content
        </a>
        <Header />
        <div id="content" tabIndex={-1} className="outline-none">
          {children}
        </div>
        <Footer />
        <RevealObserver />
      </ViewTransitionProvider>
    </>
  );
}
