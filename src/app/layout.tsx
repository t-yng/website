import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Archivo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { defaultLocale } from "@/lib/i18n";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  variable: "--font-archivo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tomohiro Yanagi — Developer",
  description: "Personal website of Tomohiro Yanagi, a software developer.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale} suppressHydrationWarning className={`${archivo.variable}`}>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
