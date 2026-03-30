import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Redox – Creative Web Development Agency",
  description: "We bring business and the digital world together with passion for creative problem solving.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
