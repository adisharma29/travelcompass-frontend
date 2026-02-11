"use client";

import { useShare } from "@/hooks/useShare";

interface ShareButtonProps {
  title: string;
  text: string;
  hash?: string;
  className?: string;
}

export function ShareButton({ title, text, hash, className }: ShareButtonProps) {
  const share = useShare();

  function handleClick() {
    const base = `${window.location.origin}${window.location.pathname}`;
    const url = hash ? `${base}#${hash}` : base;
    share(title, text, url);
  }

  return (
    <button
      className={`flex items-center justify-center w-10 h-10 border-none bg-accent/10 rounded-full cursor-pointer tap-highlight-none shrink-0 active:bg-accent/20 ${className || ""}`}
      onClick={handleClick}
    >
      <svg
        className="w-5 h-5 text-accent"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
        <polyline points="16 6 12 2 8 6" />
        <line x1="12" y1="2" x2="12" y2="15" />
      </svg>
    </button>
  );
}
