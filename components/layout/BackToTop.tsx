"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { ChevronUpIcon } from "@/components/ui/icons";

/**
 * Floating "back to top" button.
 *
 * Shows in the bottom-right corner only once the user scrolls near the very
 * bottom of a scrollable page, then smoothly scrolls them back up. It stays
 * mounted and just fades in and out so it can animate, and drops out of the
 * tab order and a11y tree while hidden.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    const update = () => {
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      // Don't show on pages that don't actually scroll.
      if (scrollable <= 0) {
        setVisible(false);
        return;
      }
      // Within 24px of the bottom counts as being at the bottom.
      setVisible(window.scrollY >= scrollable - 24);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollToTop = () => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = window.scrollY;
    if (reduced || start === 0) {
      window.scrollTo(0, 0);
      return;
    }

    // Custom animation so the rise is slow and gentle. The native "smooth"
    // behaviour is too fast and you can't configure it. Duration scales with
    // distance, clamped to a calm 0.9s to 1.8s.
    const duration = Math.min(1800, Math.max(900, start * 0.8));
    const startTime = performance.now();
    const easeInOutCubic = (t: number) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      window.scrollTo(0, Math.round(start * (1 - easeInOutCubic(t))));
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label={t("backToTop")}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed bottom-16 right-4 z-40 grid cursor-pointer place-items-center rounded-full text-black shadow-lg",
        "size-11 gradient-brand sm:bottom-24 sm:right-6 sm:size-12",
        "transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-xl",
        visible ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <ChevronUpIcon className="size-6" />
    </button>
  );
}
