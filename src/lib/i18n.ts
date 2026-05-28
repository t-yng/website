export type Locale = "ja" | "en";
export const locales: Locale[] = ["ja", "en"];
export const defaultLocale: Locale = "en";

export function isLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
