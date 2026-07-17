"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { setTheme } from "@/app/actions/theme";

type ThemeSwitcherProps = {
  theme: "light" | "dark";
};

export function ThemeSwitcher({ theme }: ThemeSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const returnTo = query ? `${pathname}?${query}` : pathname;

  return (
    <form className="theme-switcher" action={setTheme}>
      <input name="returnTo" type="hidden" value={returnTo} />
      <button type="submit" name="theme" value="light" aria-pressed={theme === "light"}>
        Light
      </button>
      <button type="submit" name="theme" value="dark" aria-pressed={theme === "dark"}>
        Dark
      </button>
    </form>
  );
}
