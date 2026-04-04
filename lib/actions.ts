"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  const password = formData.get("password") as string;
  const correctPassword = process.env.DASHBOARD_PASSWORD;

  if (password === correctPassword) {
    const cookieStore = await cookies();
    cookieStore.set("dashboard_auth", password, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    redirect("/admin");
  }

  return { error: "Fel lösenord" };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("dashboard_auth");
  redirect("/login");
}
