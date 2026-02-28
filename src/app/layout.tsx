import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SEO Neo Results Dashboard",
  description: "SEO ranking results dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" style={{ scrollBehavior: 'smooth' }}>
      <body className="page-background">{children}</body>
    </html>
  );
}
