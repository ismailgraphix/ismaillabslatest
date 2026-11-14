import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { hasEnoughPosts } from "@/lib/queries";

// Every public page, including /portfolio, uses this one header and footer.
async function Header() {
  return <Navbar showBlog={await hasEnoughPosts()} />;
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}
