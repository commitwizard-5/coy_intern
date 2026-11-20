import type { Metadata } from "next";
import Link from "next/link";
import { TabBar } from "@/components/tab-bar";
import { Icon } from "@/components/icon";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Coy Discover",
    template: "%s | Coy Discover",
  },
  description:
    "Discover people who share your interests, with privacy at the heart of every connection.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="min-h-full">
        <div className="app-shell">
          <header className="app-header">
            <Link aria-label="Coy Discover home" className="brand" href="/home">
              <span className="brand-mark">
                <Icon name="heart" size={18} />
              </span>
              <span className="brand-wordmark">coy</span>
              <span className="brand-divider" />
              <span className="brand-product">discover</span>
            </Link>
            <div className="privacy-pill">
              <span className="privacy-dot" />
              PRIVATE BY DESIGN
            </div>
          </header>
          <main className="app-main">{children}</main>
          <TabBar />
        </div>
      </body>
    </html>
  );
}
