/** @format */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { MainApp } from "@/components/layout/MainApp";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { dir } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/server";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "StreaMatrix — Browse & watch",
    template: "%s · StreaMatrix",
  },
  description:
    "A small content browser: search a catalog of titles, filter by category, and stream them with an HLS video player.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={dir(locale)}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="antialiased" suppressHydrationWarning>
        <I18nProvider locale={locale}>
          <MainApp>{children}</MainApp>
        </I18nProvider>
      </body>
    </html>
  );
}
