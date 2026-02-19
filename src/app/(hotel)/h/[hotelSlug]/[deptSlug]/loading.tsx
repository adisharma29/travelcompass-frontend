export default function DeptDetailLoading() {
  return (
    <div className="animate-pulse">
      {/* Header skeleton */}
      <div className="h-12 border-b border-black/5 flex items-center px-4 gap-3">
        <div className="size-5 rounded bg-black/5" />
        <div className="h-4 w-32 bg-black/5 rounded" />
      </div>

      <div className="max-w-6xl mx-auto md:grid md:grid-cols-[minmax(300px,400px)_1fr] md:gap-8 md:px-6 md:py-6">
        {/* Left column: Photo + schedule */}
        <div>
          {/* Photo skeleton */}
          <div className="aspect-[16/9] w-full bg-black/5 md:rounded-2xl" />

          {/* Schedule skeleton */}
          <div className="px-5 py-4 border-b border-black/5 md:border-b-0 md:px-0">
            <div className="h-4 w-24 bg-black/5 rounded mb-1" />
            <div className="h-3 w-36 bg-black/5 rounded" />
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Description skeleton */}
          <div className="px-5 py-4 border-b border-black/5 md:px-0 md:border-b-0 space-y-2">
            <div className="h-3 w-full bg-black/5 rounded" />
            <div className="h-3 w-4/5 bg-black/5 rounded" />
            <div className="h-3 w-3/5 bg-black/5 rounded" />
          </div>

          {/* Experience cards skeleton */}
          <div className="py-4">
            <div className="h-5 w-28 bg-black/5 rounded mx-5 md:mx-0 mb-4" />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4">
                <div className="size-20 md:size-28 rounded-xl bg-black/5 flex-shrink-0" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 w-3/4 bg-black/5 rounded" />
                  <div className="h-3 w-1/2 bg-black/5 rounded" />
                  <div className="h-7 w-16 bg-black/5 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
