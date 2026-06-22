import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";

/** Shown when `notFound()` is called for an unknown title id. */
export default function TitleNotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-gradient text-6xl font-bold">404</p>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Title not found</h1>
        <p className="text-muted">We couldn’t find that title in the catalog.</p>
      </div>
      <Link href="/" className={buttonStyles()}>
        Back to browse
      </Link>
    </div>
  );
}
