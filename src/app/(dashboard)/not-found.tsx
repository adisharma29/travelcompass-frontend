import Link from "next/link";

export default function DashboardNotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <h2 className="text-lg font-semibold">Page not found</h2>
      <p className="text-sm text-muted-foreground">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/dashboard"
        className="text-sm text-primary underline underline-offset-4 hover:no-underline"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
