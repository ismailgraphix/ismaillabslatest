import Footer from "@/components/Footer";
import ConditionalNavbar from "@/components/ConditionalNavbar";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ConditionalNavbar />
      {children}
      <Footer />
    </>
  );
}
