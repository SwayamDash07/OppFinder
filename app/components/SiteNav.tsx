"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clearProfile } from "@/app/actions/profile";
import type { UserProfile } from "@/lib/profile";
import { getProfileDisplayName } from "@/lib/session";

type SiteNavProps = {
  accountEmail: string | null;
  profile: UserProfile | null;
};

const navItems = [
  { href: "/matches", label: "Dashboard" },
  { href: "/browse", label: "Browse" }
];

export function SiteNav({ accountEmail, profile }: SiteNavProps) {
  const pathname = usePathname();
  const isLoggedIn = Boolean(accountEmail);
  const isPublicEntryPage = pathname === "/" || pathname === "/login" || pathname === "/signup";

  if (!isLoggedIn && isPublicEntryPage) {
    return null;
  }

  return (
    <div className="site-header__actions">
      <nav className="site-nav" aria-label="Primary navigation">
        {isLoggedIn
          ? navItems.map((item) => {
              const isActive =
                item.href === "/matches"
                  ? pathname === "/matches" || pathname.startsWith("/matches/")
                  : pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  className={isActive ? "is-active" : undefined}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })
          : null}
        {isLoggedIn ? (
          <Link
            className={pathname === "/profile" ? "is-active" : undefined}
            href="/profile"
          >
            Profile
          </Link>
        ) : (
          <Link
            className={pathname === "/profile" ? "is-active" : undefined}
            href="/profile"
          >
            Create profile
          </Link>
        )}
      </nav>

      {isLoggedIn ? (
        <div className="session-bar">
          <span className="user-chip" title={profile ? getProfileDisplayName(profile) : accountEmail ?? ""}>
            <span className="user-chip__dot" aria-hidden="true" />
            {profile ? getProfileDisplayName(profile) : accountEmail}
          </span>
          <form action={clearProfile}>
            <button className="button button--secondary button--compact" type="submit">
              Logout
            </button>
          </form>
        </div>
      ) : (
        <div className="session-bar">
          <Link className="button button--secondary button--compact" href="/login">
            Login
          </Link>
        </div>
      )}
    </div>
  );
}
