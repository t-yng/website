import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { locales } from "@/repositories/PostRepository";
import type { Locale } from "@/repositories/PostRepository";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!locales.includes(lang as Locale)) notFound();

  return (
    <>
      <Header lang={lang as Locale} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
