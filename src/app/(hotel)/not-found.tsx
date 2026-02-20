import Link from "next/link";

export default function HotelNotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-lg font-semibold">Page not found</h2>
      <p className="text-sm text-neutral-500">
        The page you&apos;re looking for doesn&apos;t exist or has been removed.
      </p>
      <Link
        href="/"
        className="text-sm underline underline-offset-4 hover:no-underline"
      >
        Go home
      </Link>
    </div>
  );
}
