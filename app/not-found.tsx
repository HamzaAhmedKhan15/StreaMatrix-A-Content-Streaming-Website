import Link from "next/link";
import { buttonStyles } from "@/components/ui/Button";

/** Global 404 page. */
export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <p className="text-gradient text-6xl font-bold">404</p>
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="text-muted">The page you’re looking for doesn’t exist.</p>
      </div>
      <Link href="/" className={buttonStyles()}>
        Back to browse
      </Link>
    </div>
  );
}
