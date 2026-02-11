/** Resolve a media URL from the API. If already absolute, return as-is. Otherwise prepend API base. */
export function mediaUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return `${base}${path.startsWith("/") ? "" : "/"}${path}`;
}
