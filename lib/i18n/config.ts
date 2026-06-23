/**
 * Locale configuration for the app's language switcher.
 *
 * The selected locale is stored in a cookie (read on the server so SSR matches
 * the client — no translation flash), and used to pick a dictionary from
 * `./dictionaries`.
 */

export const LOCALES = ["en", "ar", "fr", "ur", "zh"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "locale";

/** Right-to-left languages — drive the document `dir` attribute. */
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
