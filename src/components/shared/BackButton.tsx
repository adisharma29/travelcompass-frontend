"use client";

interface BackButtonProps {
  onClick: () => void;
}

export function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      className="flex items-center justify-center w-9 h-9 border-none bg-accent/10 rounded-full cursor-pointer tap-highlight-none shrink-0 active:bg-accent/20"
      onClick={onClick}
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
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
  );
}
