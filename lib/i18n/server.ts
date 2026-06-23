import "server-only";
import { cookies } from "next/headers";
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from "./config";
import { dictionaries, type MessageKey } from "./dictionaries";

/** The active locale for this request, read from the `locale` cookie. */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const value = store.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
}

/**
 * Server-side translator. Returns the current `locale` and a `t(key)` lookup,
 * falling back to English (then the key itself) for any missing string.
 */
export async function getTranslator(): Promise<{
  locale: Locale;
  t: (key: MessageKey) => string;
}> {
  const locale = await getLocale();
  const messages = dictionaries[locale];
  return {
    locale,
    t: (key) => messages[key] ?? dictionaries.en[key] ?? key,
  };
}
