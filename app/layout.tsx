import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sofie Dashboard",
  description: "Personlig projektdashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sv" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
