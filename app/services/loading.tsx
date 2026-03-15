//app/services/loading.tsx

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-16">
        {/* Header skeleton */}
        <div className="h-12 w-56 bg-secondary animate-pulse rounded-lg mb-4" />
        <div className="h-6 w-80 bg-secondary animate-pulse rounded-lg mb-12" />

        {/* Category filter skeleton */}
        <div className="flex gap-2 mb-8">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-24 bg-secondary animate-pulse rounded-full"
            />
          ))}
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/50 overflow-hidden animate-pulse bg-card/50"
            >
              <div className="h-44 bg-secondary" />
              <div className="p-5 space-y-3">
                <div className="h-4 w-3/4 bg-secondary rounded" />
                <div className="h-3 w-full bg-secondary rounded" />
                <div className="h-3 w-2/3 bg-secondary rounded" />
                <div className="h-3 w-1/2 bg-secondary rounded" />
                <div className="flex justify-between items-center mt-4">
                  <div className="h-7 w-16 bg-secondary rounded" />
                  <div className="h-9 w-24 bg-secondary rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}