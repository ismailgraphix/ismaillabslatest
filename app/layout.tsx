// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { PageViewTracker } from "@/components/PageViewTracker";

export const metadata: Metadata = {
  title: "Ismail Labs",
  description: "We bring business and the digital world together with passion for creative problem solving.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PageViewTracker />
        {children}
      </body>
    </html>
  );
} 