"use client";

import { cn } from "@/lib/utils";

interface HtmlContentProps {
  html: string;
  className?: string;
}

/**
 * Renders server-sanitized HTML (bleach) with Tiptap prose styles.
 * Only use for content that has been sanitized on the backend.
 */
export function HtmlContent({ html, className }: HtmlContentProps) {
  return (
    <div
      className={cn("tiptap-editor prose prose-sm", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
