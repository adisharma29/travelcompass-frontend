export default function ExpDetailLoading() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="h-12 border-b border-black/5 flex items-center px-4 gap-3">
        <div className="size-5 rounded bg-black/5" />
        <div className="h-4 w-28 bg-black/5 rounded" />
      </div>

      <div className="max-w-6xl mx-auto md:grid md:grid-cols-[1fr_380px] md:gap-8 md:px-6 md:py-6">
        {/* Left column: Gallery skeleton */}
        <div>
          <div className="aspect-[3/2] w-full bg-black/5 md:rounded-2xl" />
        </div>

        {/* Right column: Info skeleton */}
        <div>
          {/* Title + price */}
          <div className="px-5 pt-5 pb-3 md:px-0 space-y-2">
            <div className="h-6 w-3/4 bg-black/5 rounded" />
            <div className="h-4 w-24 bg-black/5 rounded" />
          </div>

          {/* Badges */}
          <div className="flex gap-2 px-5 pb-4 md:px-0">
            <div className="h-6 w-16 bg-black/5 rounded-full" />
            <div className="h-6 w-20 bg-black/5 rounded-full" />
            <div className="h-6 w-24 bg-black/5 rounded-full" />
          </div>

          {/* Description */}
          <div className="px-5 py-4 border-t border-black/5 md:px-0 space-y-2">
            <div className="h-3 w-full bg-black/5 rounded" />
            <div className="h-3 w-4/5 bg-black/5 rounded" />
            <div className="h-3 w-3/5 bg-black/5 rounded" />
            <div className="h-3 w-2/3 bg-black/5 rounded" />
          </div>

          {/* Highlights */}
          <div className="px-5 py-4 border-t border-black/5 md:px-0 space-y-2">
            <div className="h-4 w-20 bg-black/5 rounded" />
            <div className="h-3 w-3/4 bg-black/5 rounded" />
            <div className="h-3 w-2/3 bg-black/5 rounded" />
            <div className="h-3 w-1/2 bg-black/5 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}
