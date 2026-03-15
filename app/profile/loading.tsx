export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <div className="h-12 w-56 bg-secondary animate-pulse rounded-lg mb-10" />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Profile card skeleton */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border/50 rounded-xl p-6 space-y-4">
              <div className="h-6 w-40 bg-secondary animate-pulse rounded" />
              <div className="flex justify-center py-4">
                <div className="w-16 h-16 rounded-full bg-secondary animate-pulse" />
              </div>
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-1">
                  <div className="h-3 w-20 bg-secondary animate-pulse rounded" />
                  <div className="h-5 w-40 bg-secondary animate-pulse rounded" />
                </div>
              ))}
              <div className="h-10 bg-secondary animate-pulse rounded-lg mt-4" />
            </div>
          </div>

          {/* Tabs skeleton */}
          <div className="lg:col-span-2">
            <div className="h-10 bg-secondary animate-pulse rounded-lg mb-6" />
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-32 bg-card border border-border/50 rounded-xl animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}