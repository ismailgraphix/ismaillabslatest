// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { PageViewTracker } from "@/components/PageViewTracker";


export const metadata: Metadata = {
  title: "Ismail Labs — Digital Agency",
  description: "We build the digital side of your business. Web design, development & brand strategy.",
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/logo.png", type: "image/png", sizes: "32x32" },
      { url: "/logo.png", type: "image/png", sizes: "192x192" },
    ],
    apple: { url: "/logo.png", sizes: "180x180" },
  },
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