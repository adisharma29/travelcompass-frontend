export default function HotelLandingLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="aspect-[16/9] lg:aspect-[21/9] w-full bg-black/5" />

      {/* Heading */}
      <div className="max-w-6xl mx-auto px-4 pt-6 pb-4">
        <div className="h-5 w-48 rounded bg-black/5 mb-2" />
        <div className="h-3 w-64 rounded bg-black/5" />
      </div>

      {/* Department grid skeleton */}
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 px-4 pb-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="aspect-[3/4] rounded-2xl bg-black/5" />
        ))}
      </div>
    </div>
  );
}
