import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg" | "icon";

const VARIANTS: Record<ButtonVariant, string> = {
  // The signature gradient button, with a soft glow that grows on hover.
  primary:
    "gradient-brand text-black font-semibold shadow-[0_8px_30px_-12px_rgba(45,200,170,0.7)] hover:shadow-[0_10px_40px_-10px_rgba(45,200,170,0.9)] hover:brightness-110",
  secondary:
    "surface-card text-foreground hover:bg-surface-2 hover:border-foreground/20",
  ghost: "text-muted hover:text-foreground hover:bg-surface-2",
};

const SIZES: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-7 text-base gap-2.5",
  icon: "h-10 w-10",
};

/**
 * Returns the className for a button-styled element. Exported separately so the
 * exact same look can be applied to a Next.js `<Link>` (see `buttonStyles` used
 * across cards and the hero) without duplicating styles.
 */
export function buttonStyles(options?: { variant?: ButtonVariant; size?: ButtonSize; className?: string }) {
  const { variant = "primary", size = "md", className } = options ?? {};
  return cn(
    "inline-flex cursor-pointer items-center justify-center rounded-full transition-all duration-200 select-none",
    "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-default",
    VARIANTS[variant],
    SIZES[size],
    className,
  );
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />;
}
