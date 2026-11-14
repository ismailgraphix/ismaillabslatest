import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { hasEnoughPosts } from "@/lib/queries";
import { ViewTransitionProvider } from "@/lib/view-transition";

// Every public page, including /about, uses this one header and footer.
async function Header() {
  return <Navbar showNotes={await hasEnoughPosts()} />;
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ViewTransitionProvider>
        <Header />
        {children}
        <Footer />
      </ViewTransitionProvider>
    </>
  );
}
