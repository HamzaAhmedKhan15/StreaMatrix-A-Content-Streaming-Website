"use client";

import { createContext, useCallback, useContext } from "react";
import { useRouter } from "next/navigation";
import { DEFAULT_LOCALE, LOCALE_COOKIE, dir, type Locale } from "./config";
import { dictionaries, type MessageKey } from "./dictionaries";

interface I18nValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Provides the active locale + a `t()` translator to client components. The
 * initial locale comes from the server (cookie), so the first client render
 * matches the server HTML. Switching writes the cookie and calls
 * `router.refresh()` so Server Components re-render in the new language too.
 */
export function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  const router = useRouter();

  // Persist the choice and re-render Server Components in the new language. The
  // server layout re-reads the cookie and feeds the new `locale` prop back in.
  const setLocale = useCallback(
    (next: Locale) => {
      document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
      document.documentElement.lang = next;
      document.documentElement.dir = dir(next);
      router.refresh();
    },
    [router],
  );

  const messages = dictionaries[locale] ?? dictionaries[DEFAULT_LOCALE];
  const t = useCallback(
    (key: MessageKey) => messages[key] ?? dictionaries.en[key] ?? key,
    [messages],
  );

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within an I18nProvider");
  return ctx;
}
