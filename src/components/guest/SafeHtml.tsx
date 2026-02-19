"use client";

import React, { useMemo, type ReactNode } from "react";
import DOMPurify from "dompurify";

const ALLOWED_TAGS = new Set([
  "p", "br", "strong", "b", "em", "i", "u", "s", "strike",
  "ul", "ol", "li", "h1", "h2", "h3", "h4", "h5", "h6",
  "blockquote", "a", "span",
]);

const ALLOWED_ATTR: Record<string, Set<string>> = {
  a: new Set(["href", "target", "rel"]),
};

/**
 * Renders sanitised HTML as React elements — no dangerouslySetInnerHTML.
 *
 * 1. DOMPurify strips anything outside the allowlist (defense-in-depth
 *    on top of the backend bleach pass).
 * 2. A recursive walk converts the sanitised DOM tree into React elements,
 *    so only known tags and attributes ever reach the DOM.
 */
export function SafeHtml({
  html,
  className,
  style,
}: {
  html: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const children = useMemo(() => {
    if (typeof window === "undefined") return null;

    const clean = DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [...ALLOWED_TAGS],
      ALLOWED_ATTR: ["href", "target", "rel"],
    });

    const doc = new DOMParser().parseFromString(clean, "text/html");
    return convertChildren(doc.body);
  }, [html]);

  return <div className={className} style={style}>{children}</div>;
}

/** Recursively convert a DOM node tree into React elements. */
function convertNode(node: Node, key: number): ReactNode {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent;
  }

  if (node.nodeType !== Node.ELEMENT_NODE) return null;

  const el = node as Element;
  const tag = el.tagName.toLowerCase();

  if (!ALLOWED_TAGS.has(tag)) return convertChildren(el);

  const props: Record<string, string | number> = { key };
  const allowed = ALLOWED_ATTR[tag];
  if (allowed) {
    for (const attr of el.attributes) {
      if (allowed.has(attr.name)) {
        // Ensure links only use safe protocols
        if (attr.name === "href") {
          const val = attr.value.trim().toLowerCase();
          if (!val.startsWith("http://") && !val.startsWith("https://") && !val.startsWith("mailto:")) {
            continue;
          }
        }
        props[attr.name] = attr.value;
      }
    }
    // Force safe target for links
    if (tag === "a") {
      props.target = "_blank";
      props.rel = "noopener noreferrer";
    }
  }

  // Self-closing tags
  if (tag === "br") {
    return <br key={key} />;
  }

  return React.createElement(tag, props, ...convertChildren(el));
}

function convertChildren(parent: Node): ReactNode[] {
  const out: ReactNode[] = [];
  parent.childNodes.forEach((child, i) => {
    const node = convertNode(child, i);
    if (node !== null) out.push(node);
  });
  return out;
}
