import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { defaultLocale, isLocale, locales } from "@/lib/i18n";

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
  const locale = isLocale(lang) ? lang : defaultLocale;

  return (
    <>
      <Header lang={locale} />
      <main>{children}</main>
      <Footer />
    </>
  );
}
