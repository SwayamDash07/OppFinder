import type { Metadata } from "next";
import { cookies } from "next/headers";
import Link from "next/link";
import "./globals.css";
import { SiteNav } from "./components/SiteNav";
import { ThemeSwitcher } from "./components/ThemeSwitcher";
import { getCurrentAccount } from "@/lib/auth";
import { getCurrentProfile } from "@/lib/server-session";

export const metadata: Metadata = {
  title: "OppFinder",
  description: "AI-ranked opportunity matching for student developers.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png"
  }
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const theme = cookieStore.get("theme")?.value === "dark" ? "dark" : "light";
  const [account, profile] = await Promise.all([
    getCurrentAccount(),
    getCurrentProfile()
  ]);

  return (
    <html lang="en" data-theme={theme}>
      <body>
        <div className="app-shell">
          <header className="site-header">
            <div className="site-header__inner">
              <Link className="brand" href="/">
                <span className="brand__wordmark">OppFinder</span>
              </Link>
              <div className="site-header__cluster">
                <SiteNav accountEmail={account?.email ?? null} profile={profile} />
                <ThemeSwitcher theme={theme} />
              </div>
            </div>
          </header>
          <main className="main">{children}</main>
        </div>
      </body>
    </html>
  );
}
