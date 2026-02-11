"use client";

interface LocationBannerProps {
  onDismiss: () => void;
}

export function LocationBanner({ onDismiss }: LocationBannerProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-[300] bg-accent text-bg px-4 py-3 flex items-center justify-between text-[13px] font-medium safe-area-top lg:left-[420px]">
      <span>Location access blocked. Enable it in your browser settings.</span>
      <button
        className="ml-3 shrink-0 text-bg/80 font-semibold border-none bg-transparent cursor-pointer"
        onClick={onDismiss}
      >
        Dismiss
      </button>
    </div>
  );
}
