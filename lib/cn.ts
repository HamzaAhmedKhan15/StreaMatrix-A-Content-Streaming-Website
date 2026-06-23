export type ClassValue = string | number | false | null | undefined;

/**
 * Tiny classname joiner. Drops falsy values so components can write conditional
 * classes inline (`cn("base", active && "on")`) without pulling in a dependency
 * like clsx.
 */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}
