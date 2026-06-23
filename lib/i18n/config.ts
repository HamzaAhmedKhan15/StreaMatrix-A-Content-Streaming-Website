/**
 * Locale config for the language switcher.
 *
 * The locale is kept in a cookie. We read it on the server too so SSR matches
 * the client and you don't get a translation flash. It picks a dictionary from
 * `./dictionaries`.
 */

export const LOCALES = ["en", "ar", "fr", "ur", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "locale";

/** Right-to-left languages, used to set the document `dir` attribute. */
const RTL_LOCALES: Locale[] = ["ar", "ur"];

/** Native names shown in the language dropdown. */
export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
  fr: "Français",
  ur: "اردو",
  zh: "中文",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

export function dir(locale: Locale): "rtl" | "ltr" {
  return RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
}
