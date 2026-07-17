"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function setTheme(formData: FormData) {
  const value = formData.get("theme");
  const theme = value === "dark" ? "dark" : "light";
  const returnTo = String(formData.get("returnTo") ?? "/");

  const cookieStore = await cookies();
  cookieStore.set("theme", theme, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365
  });

  redirect(returnTo.startsWith("/") && !returnTo.startsWith("//") ? returnTo : "/");
}
