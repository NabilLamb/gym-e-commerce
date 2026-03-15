//app/products/loading.tsx

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl mx-auto px-4 py-16">
        {/* Header skeleton */}
        <div className="h-12 w-64 bg-secondary animate-pulse rounded-lg mb-4" />
        <div className="h-6 w-96 bg-secondary animate-pulse rounded-lg mb-16" />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar skeleton */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
              <div className="h-5 w-20 bg-secondary animate-pulse rounded" />
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-10 bg-secondary animate-pulse rounded-lg" />
              ))}
            </div>
          </div>

          {/* Grid skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/50 overflow-hidden animate-pulse bg-card/50"
                >
                  <div className="h-52 bg-secondary" />
                  <div className="p-4 space-y-3">
                    <div className="h-3 w-16 bg-secondary rounded" />
                    <div className="h-4 w-3/4 bg-secondary rounded" />
                    <div className="h-3 w-full bg-secondary rounded" />
                    <div className="h-3 w-2/3 bg-secondary rounded" />
                    <div className="h-9 bg-secondary rounded-lg mt-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}