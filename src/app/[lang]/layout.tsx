import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
